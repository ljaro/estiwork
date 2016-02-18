#pragma once
#include <boost/date_time/posix_time/posix_time_types.hpp>

class DatabaseWriter
{
public:
	DatabaseWriter(boost::posix_time::time_duration delay);
	~DatabaseWriter();

	void operator()();
private:
	boost::posix_time::time_duration delay;
};

