#include "local_rpc_handler.h"
#include <boost\thread.hpp>
#include <boost\thread\mutex.hpp>

#include <string>
extern boost::mutex queue_mutex;
LocalRpcHandler::LocalRpcHandler(std::deque<EventSample>& message_queue) :
	message_queue(message_queue),	
	memBuf(new TMemoryBuffer(10000)),
	protocol(new TJSONProtocol(memBuf))
{
	// Your initialization goes here
}

void LocalRpcHandler::ping() {
	// Your implementation goes here
	printf("ping\n");
}

extern ::rpc::thrift::LocalRpcClient* g_LocalRpcClient;
void LocalRpcHandler::send(const EventSample& sample) {

	boost::mutex::scoped_lock scoped_lock(queue_mutex);	
	message_queue.push_back(sample);

	//sample.write(&*protocol);
	//std::string str;
	//str = memBuf->getBufferAsString();
	//memBuf->resetBuffer();
	
	pantheios::log_INFORMATIONAL("sample received");
}