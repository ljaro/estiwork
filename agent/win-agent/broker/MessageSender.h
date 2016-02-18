#pragma once
#include <boost/date_time/posix_time/posix_time_types.hpp>

class MessageSender
{
public:
	MessageSender(boost::posix_time::time_duration delay);
	~MessageSender();

	void operator()();
private:
	boost::posix_time::time_duration delay;
};

