#include "DatabaseWriter.h"
#include <boost\thread.hpp>
#include <boost\thread\mutex.hpp>
#include <boost\shared_ptr.hpp>

#include <thrift/protocol/TBinaryProtocol.h>
#include "TSimpleJSONProtocol.h"
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TPipeServer.h>
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TBufferTransports.h>
#include <thrift\protocol\TProtocolTap.h>

#include "local_rpc_handler.h"
#include "DatabaseInterface.h"
#include "RabbitMessageSender.h"

extern boost::mutex queue_mutex;
extern boost::mutex queue_mutex2;
extern std::deque<EventSample> message_queue;
extern std::deque<std::vector<uint8_t> > raw_message_queue;

DatabaseWriter::DatabaseWriter(boost::posix_time::time_duration delay)
	:delay(delay)
{
}


DatabaseWriter::~DatabaseWriter()
{
}

void DatabaseWriter::operator()()
{
	shared_ptr<TMemoryBuffer> memBuff(new TMemoryBuffer());

	shared_ptr<TJSONProtocol> protocol(new TJSONProtocol(memBuff));
	shared_ptr<TSimpleJSONProtocol> protoDecor(new TSimpleJSONProtocol(memBuff));

	DatabaseInterface db;

	while (1)
	{
		

		{// scope for mutex
			boost::mutex::scoped_lock scoped_lock(queue_mutex);

			if (!message_queue.empty())
			{
				pantheios::log_INFORMATIONAL("Arrived messages waiting for write ", pantheios::integer(message_queue.size()));
			}

			while (!message_queue.empty()) {

				EventSample sample = message_queue.front();
				sample.write(protoDecor.get());

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

				boost::this_thread::sleep(boost::posix_time::millisec(100));				
			}
		}


		boost::this_thread::sleep(delay);
	}
}