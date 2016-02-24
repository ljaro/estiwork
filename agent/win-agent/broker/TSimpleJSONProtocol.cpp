#include "TSimpleJSONProtocol.h"


#include <thrift/transport/TTransportException.h>

using namespace apache::thrift::transport;

namespace apache { namespace thrift { namespace protocol {

TSimpleJSONProtocol::TSimpleJSONProtocol(boost::shared_ptr<TTransport> trans)
	: TJSONProtocol(trans)
{
}

TSimpleJSONProtocol::~TSimpleJSONProtocol()
{
}

uint32_t TSimpleJSONProtocol::writeFieldBegin_virt(const char* name,
                           const TType fieldType,
                           const int16_t fieldId)
{
	uint32_t result = writeString_virt(name);	
	return result;
}

uint32_t TSimpleJSONProtocol::writeFieldEnd_virt()
{
	return 1;
}

}}} // apache::thrift::protocol
