#pragma once
#include "stdafx.h"
#include <deque>
#include <boost\date_time.hpp>
#include "SampleMessage.h"
//#include "RpcClient.h"
#include "helperdef.h"
#include "../../thrift_gen/gen-cpp/LocalRpc.h"
#include "../../thrift_gen/gen-cpp/da2dba_constants.h"

#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/protocol/TJSONProtocol.h>
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TPipe.h>
#include <thrift/transport/TBufferTransports.h>
#include <boost\shared_ptr.hpp>
//#include "../../../../../lib/thrift/thrift-0.9.1/contrib/zeromq/TZmqClient.h"
//#include <zmq.hpp>
using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;


class MessageSender
{
public:
	MessageSender(void);
	~MessageSender(void);
	void SendSamples(std::deque<SampleMessage>& stack);
private:
	// ZERO MQ
	//int socktype;
	//const char* zmq_endpoint;
	//zmq::context_t zmq_ctx;
	//boost::shared_ptr<TZmqClient> transport;
private:
	boost::shared_ptr<TSocket> socket;
	boost::shared_ptr<TPipe> pipe;
	boost::shared_ptr<TBufferedTransport> transport;
	//boost::shared_ptr<TBinaryProtocol> protocol;
	boost::shared_ptr<TJSONProtocol> protocol;
	
	::rpc::thrift::LocalRpcClient client;

	static int64_t ToPosix64(const boost::posix_time::ptime& pt)
	{
		using namespace boost::posix_time;
		static ptime epoch(boost::gregorian::date(1970, 1, 1));
		time_duration diff(pt - epoch);
		return (diff.ticks() / diff.ticks_per_second());
	}

	void WaitConnection();

	DISALLOW_COPY_AND_ASSIGN(MessageSender);
};

