
#ifndef _THRIFT_PROTOCOL_TSIMPLEJSONPROTOCOL_H_
#define _THRIFT_PROTOCOL_TSIMPLEJSONPROTOCOL_H_ 1

#include <thrift\protocol\TJSONProtocol.h>
#include <stack>

namespace apache { namespace thrift { namespace protocol {


class TSimpleJSONProtocol : public TJSONProtocol
{
public:
	TSimpleJSONProtocol(boost::shared_ptr<TTransport> trans);
	~TSimpleJSONProtocol();

	uint32_t writeFieldBegin_virt(const char* name,
                           const TType fieldType,
                           const int16_t fieldId);
	uint32_t writeFieldEnd_virt();
};

}}}

#endif // #define _THRIFT_PROTOCOL_TSIMPLEJSONPROTOCOL_H_ 1