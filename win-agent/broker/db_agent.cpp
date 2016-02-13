// This autogenerated skeleton file illustrates how to build a server.
// You should copy it to another filename to avoid overwriting it.
#include "stdafx.h"

#include "local_rpc_handler.h"
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/protocol/TJSONProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TPipeServer.h>
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TBufferTransports.h>
#include <thrift\protocol\TProtocolTap.h>
#include <boost\thread.hpp>
#include <boost\thread\mutex.hpp>
#include <deque>
#include <vector>


#include "DatabaseInterface.h"
//#include <sstream>

#include "RabbitMessageSender.h"

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;
using namespace ::apache::thrift::server;

using boost::shared_ptr;

using namespace  ::rpc::thrift;

std::deque<EventSample> message_queue;
std::deque<std::vector<uint8_t> > raw_message_queue;
boost::mutex queue_mutex;
boost::mutex queue_mutex2;

::rpc::thrift::LocalRpcClient* g_LocalRpcClient;


//#pragma comment(lib, "pantheios.1.be.WindowsConsole.vc10.mt.debug.lib")
#pragma comment(lib, "pantheios.1.core.vc10.mt.debug.lib")
#pragma comment(lib, "pantheios.1.util.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.fe.null.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.fe.all.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.bec.file.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.be.file.vc10.mt.debug.lib")

//extern "C" const char PANTHEIOS_FE_PROCESS_IDENTITY[] = "MyApplication";

namespace
{
	static int s_log_level = pantheios::debug;
}

PANTHEIOS_CALL(int) pantheios_fe_isSeverityLogged(void *token,
	int severity, int backEndId)
{
	return severity <= s_log_level;
}


PANTHEIOS_CALL(int) pantheios_fe_init(void    * /* reserved */
	, void    **ptoken)
{
	*ptoken = NULL;

	return 0;
}

PANTHEIOS_CALL(void) pantheios_fe_uninit(void * /* token */)
{}

PANTHEIOS_CALL(char const*) pantheios_fe_getProcessIdentity(void * /* token */)
{
	return "example_cpp_custom_fe";
}




void ReadFromDatabase(boost::posix_time::seconds delay)
{
	using namespace std;

	RabbitMessageSender sender;
	sender.init();
	

	while (1)
	{
		std::cout << "ReadFromDatabase loop" << std::endl;
		boost::mutex::scoped_lock scoped_lock(queue_mutex2); //TODO dlugo czeka ten mutex
		while (!raw_message_queue.empty())
		{
			pantheios::log_INFORMATIONAL("ReadFromDatabase loop2 begin");

			vector<uint8_t> &msg = raw_message_queue.front();

			string str(msg.begin(), msg.end());
			pantheios::log_INFORMATIONAL(str);

			sender.sendOne(msg);

			raw_message_queue.pop_front();
			boost::this_thread::sleep(boost::posix_time::millisec(200));
			pantheios::log_INFORMATIONAL("ReadFromDatabase loop2 end");
		}

		boost::this_thread::sleep(delay);
	}

	sender.close();
}

//TODO zastanowic sie nad przeniesieniem rozpakowania do odbierania zeby mozna bylo wczesniej logowac zawartosc
void WriteToDatabase(boost::posix_time::seconds delay)
{
	shared_ptr<TMemoryBuffer> memBuff(new TMemoryBuffer());
	TJSONProtocol protocol(memBuff);
	DatabaseInterface db;
	//MessageSender sender;


	while (1)
	{

		std::cout << "WriteToDatabase loop" << std::endl;
		boost::mutex::scoped_lock scoped_lock(queue_mutex);
		while (!message_queue.empty()) {			
			pantheios::log_INFORMATIONAL("WriteToDatabase loop2 begin");

			
			EventSample sample = message_queue.front();
			sample.write(&protocol);

			uint8_t* buffer = NULL;
			uint32_t size;
			memBuff->getBuffer(&buffer, &size);
			
			//TOOD sprawdzanie czy sie powiodlo
			db.write(const_cast<const uint8_t*>(buffer), size);

			std::vector<uint8_t> v;
			v.assign(buffer, buffer + size);

			{
				boost::mutex::scoped_lock scoped_lock(queue_mutex2);
				raw_message_queue.push_back(v);
			}

			memBuff->flush();
			memBuff->resetBuffer();


			message_queue.pop_front();

			boost::this_thread::sleep(boost::posix_time::millisec(200));
			pantheios::log_INFORMATIONAL("WriteToDatabase loop2 end");
		}
		

		boost::this_thread::sleep(delay);
	}
}


int main(int argc, char **argv) {


	WORD wVersionRequested;
	WSADATA wsaData;
	int err;

	/* Use the MAKEWORD(lowbyte, highbyte) macro declared in Windef.h */
	wVersionRequested = MAKEWORD(2, 2);

	err = WSAStartup(wVersionRequested, &wsaData);
	if (err != 0) {
		/* Tell the user that we could not find a usable */
		/* Winsock DLL.                                  */
		printf("WSAStartup failed with error: %d\n", err);
		return 1;
	}



	boost::thread db_writer(WriteToDatabase, boost::posix_time::seconds(1));
	boost::thread db_reader(ReadFromDatabase, boost::posix_time::seconds(3));

	shared_ptr<LocalRpcHandler> handler(new LocalRpcHandler(message_queue));
	shared_ptr<TProcessor> processor(new LocalRpcProcessor(handler));
	shared_ptr<TServerTransport> serverTransport(new TPipeServer("\\\\.\\pipe\\Pipe1"));
	shared_ptr<TTransportFactory> transportFactory(new TBufferedTransportFactory());
	
	shared_ptr<TProtocolFactory> protocolFactory(new TJSONProtocolFactory());
	//shared_ptr<TProtocolFactory> protocolFactory(new TBinaryProtocolFactory());

	TSimpleServer server(processor, serverTransport, transportFactory, protocolFactory);
	server.serve();
	//boost::thread thrift_server(&TSimpleServer::serve, server);
	

	

	/*
	zmq::context_t ctx(1);
	try
	{
		TZmqServer oneway_server(processor, ctx, "tcp://127.0.0.1:9090", ZMQ_ROUTER);
		TZmqMultiServer multiserver;		
		multiserver.servers().push_back(&oneway_server);
		multiserver.serveForever();

	}
	catch (zmq::error_t e)
	{
		pantheios::log_CRITICAL("zero mq error, ", e);
	}
	catch (const TException& ee)
	{
		pantheios::log_CRITICAL("zero mq error, ", ee);
	}
	*/



	// klient ktory wysyla to co jest w bazie	
	// sprawdza czy jest cos do wyslania w bazie (od najstarszych)
	// sprawdza czy jest polaczenie z serwerem
	// wysyla

	return 0;
}

