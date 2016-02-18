#include "MessageSender.h"
//#include "../../rpc_sample_client/template_h.h"

#ifdef _UNICODE
#include <boost\archive\text_woarchive.hpp>
#else
#include <boost/archive/text_oarchive.hpp>
#endif

#include <boost\date_time\posix_time\time_formatters.hpp>
#include <boost/date_time/posix_time/time_serialize.hpp>
#include <boost\date_time.hpp>
#include <boost/iostreams/stream.hpp>
#include <boost/iostreams/device/back_inserter.hpp>
#include <boost\shared_ptr.hpp>
#include <string>
//#pragma comment(lib, "rpcrt4.lib")
//#pragma warning(disable: 4308)
#include <tchar.h>
#include "../../utils/WindowsLocalUser.h"



MessageSender::MessageSender(void):
	pipe(new TPipe("\\\\.\\pipe\\Pipe1")),
	transport(new TBufferedTransport(pipe)),
	//protocol(new TBinaryProtocol(transport)),
	protocol(new TJSONProtocol(transport)),
	client(protocol)
{	
	try
	{
		transport->open();
	}
	catch (const TTransportException& ee)
	{
		pantheios::log_CRITICAL("open connection, ", ee);
	}
}


MessageSender::~MessageSender(void)
{
	if (transport->isOpen())
	transport->close();
}

void MessageSender::WaitConnection()
{
	bool oneTime = 0;	

	try
	{ 
		transport->flush();
	}
	catch (TTransportException& e)
	{
		pantheios::log_ERROR(e);
	}

	while (!transport->isOpen())
	{

		try
		{
			transport->open();
		}
		catch (TTransportException& e)
		{						
			if (oneTime == 0)
			{
				oneTime = 1;
				pantheios::log_ERROR("Cannot open connection to server ", e);
			}			
		}

		Sleep(1000);
	}
}



void MessageSender::SendSamples(std::deque<SampleMessage>& stack)
{
	static int messages_sent = 0;
	
	static bool start_flag = 0;
	static boost::posix_time::ptime start_time;
	static boost::posix_time::ptime end_time;

	/*
		quick info
	*/

	static WindowsLocalUser localUserInfo;

	/*
		quick info end
	*/
	
	int stackSizeBegin = stack.size();

	std::deque<SampleMessage> failStack;
	while(stack.size()>0)	
	{
		SampleMessage msg = stack.front();


		rpc::thrift::EventSample rpcEventSample;
		rpc::thrift::Sample rpcMsg;		
		rpc::thrift::Machine rpcMachine;
		rpc::thrift::User rpcUser;
		

		rpcEventSample.__set_duration(msg.duration.total_seconds());
		msg.sample.image_fs_name_.is_initialized() == true ? rpcMsg.__set_image_fs_name(msg.sample.image_fs_name_.get()) : (void)0;
		msg.sample.image_full_path_.is_initialized() == true ? rpcMsg.__set_image_full_path(msg.sample.image_full_path_.get()) : (void) 0;
		msg.sample.resource_image_name_.is_initialized() == true ? rpcMsg.__set_resource_image_name(msg.sample.resource_image_name_.get()) : (void) 0;
		msg.sample.window_caption_.is_initialized() == true ? rpcMsg.__set_window_caption(msg.sample.window_caption_.get()) : (void) 0;
		
		if (msg.sample.probe_time_.is_initialized() == true)
		{
			//ToPosix64(msg.sample.probe_time_.get());  // kiedys bylo trzymane w unix epoch time int64

			rpcEventSample.probe_time = boost::posix_time::to_iso_extended_string(msg.sample.probe_time_.get());			
		}
		
		msg.sample.hash_.is_initialized() == true ? rpcMsg.__set_hash(msg.sample.hash_.get()) : (void) 0;
		rpcMachine.__set_machine_sid(msg.machinesid);
		rpcUser.__set_user_sid(msg.usersid);
		rpcUser.__set_user_login(localUserInfo.name);
		rpcUser.__set_work_mode(msg.sample.work_mode);

		rpcUser.__set_presence(msg.sample.idle == true ? rpc::thrift::g_da2dba_constants.IDLE : rpc::thrift::g_da2dba_constants.ACTIVE);

		rpcEventSample.__set_sample(rpcMsg);
		rpcEventSample.__set_machine(rpcMachine);
		rpcEventSample.__set_user(rpcUser);


		
		if (start_flag == 1 && start_time > msg.sample.probe_time_.get())
		{
			pantheios::log_ALERT("probe_time ordering problem");
		}

		if (!start_flag)
		{
			start_time = msg.sample.probe_time_.get();
			pantheios::log_INFORMATIONAL("Start time " + boost::posix_time::to_iso_extended_string(start_time));
			start_flag = 1;
		}

		try
		{			
			client.send(rpcEventSample);
			
			int stackSize = stack.size();

			messages_sent++;
			stack.pop_front();

			pantheios::log_INFORMATIONAL("Sample sent (", dd::integer(stackSize), "/", dd::integer(stackSizeBegin), ")");
		}
		catch (const TException& ee)
		{
			pantheios::log_WARNING("MessageSender::SendSamples - ", ee);
			Sleep(500);
			transport->close();
			WaitConnection();
		}
		
	}

	pantheios::log_DEBUG("All samples sent(", pantheios::integer(messages_sent), "). Stack is empty. Fails count: ", pantheios::integer(failStack.size()));
	
	std::swap(stack, failStack);
}

