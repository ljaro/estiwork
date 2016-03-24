#pragma once

#if _UNICODE
#include <boost/archive/text_woarchive.hpp>
#include <boost/archive/text_wiarchive.hpp>
#else
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#endif

#include <boost/date_time/posix_time/time_serialize.hpp>
#include <boost\date_time.hpp>
#include <boost/serialization/level.hpp>
#include <boost/serialization/tracking.hpp>
#include "Sample.h"

class SampleMessage
{
public:
	Sample sample;
	boost::posix_time::time_duration duration;
	std::string usersid;
	std::string machinesid;
private:

};
