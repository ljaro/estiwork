#include "MessageSender.h"

#include <boost\thread.hpp>
#include <boost\thread\mutex.hpp>
#include <deque>

#include "RabbitMessageSender.h"
#include "local_rpc_handler.h"

extern boost::mutex queue_mutex;
extern boost::mutex queue_mutex2;
extern std::deque<EventSample> message_queue;
extern std::deque<std::vector<uint8_t> > raw_message_queue;


MessageSender::MessageSender(boost::posix_time::time_duration delay)
	:delay(delay)
{
}


MessageSender::~MessageSender()
{
}

void MessageSender::operator()()
{
	using namespace std;

	RabbitMessageSender sender;
	sender.init();


	while (1)
	{		
		{// scope for mutex
			boost::mutex::scoped_lock scoped_lock(queue_mutex2);

			if (!raw_message_queue.empty())
			{
				pantheios::log_DEBUG("Messages queued for send: ", pantheios::integer(raw_message_queue.size()));
			}			

			while (!raw_message_queue.empty())
			{
				vector<uint8_t> &msg = raw_message_queue.front();

				string str(msg.begin(), msg.end());
				//pantheios::log_INFORMATIONAL(str);

				sender.sendOne(msg);

				raw_message_queue.pop_front();
				boost::this_thread::sleep(boost::posix_time::millisec(100));
			}
		}
		boost::this_thread::sleep(delay);
	}

	sender.close();
}