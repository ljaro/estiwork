#pragma once
#include "stdafx.h"
#include "../thrift_gen/gen-cpp/LocalRpc.h"
#include <deque>
#include <boost\shared_ptr.hpp>
#include <thrift/protocol/TJSONProtocol.h>
//#include <thrift\transport\TFileTransport.h>
//#include <thrift\transport\TSimpleFileTransport.h>
#include <thrift\transport\TBufferTransports.h>

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;
//using namespace ::apache::thrift::server;
using namespace  ::rpc::thrift;
using boost::shared_ptr;

class LocalRpcHandler : virtual public LocalRpcIf {
public:
	shared_ptr<TMemoryBuffer> memBuf;	
	shared_ptr<TJSONProtocol> protocol;


	LocalRpcHandler(std::deque<EventSample>& message_queue);
	void ping();
	void send(const EventSample& sample);
private:
	std::deque<EventSample>& message_queue;
};

