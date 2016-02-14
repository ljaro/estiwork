#pragma once

#if _UNICODE
#include <boost/archive/text_woarchive.hpp>
#include <boost/archive/text_wiarchive.hpp>
#else
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#endif
//#include <boost/archive/binary_iarchive.hpp>
//#include <boost/archive/binary_oarchive.hpp>

#include <boost/date_time/posix_time/time_serialize.hpp>
#include <boost\date_time.hpp>
#include <boost/serialization/level.hpp>
#include <boost/serialization/tracking.hpp>
#include "Sample.h"

class SampleMessage
{
	friend class boost::serialization::access;
public:
	Sample sample;
	boost::posix_time::time_duration duration;
	std::string usersid;
	std::string machinesid;
private:

	template<class Archive>
    void serialize(Archive & ar, const unsigned int version)
    {
		ar & sample;
        ar & duration;
		ar & usersid;
		ar & machinesid;
    }

};

BOOST_CLASS_TRACKING(SampleMessage, boost::serialization::track_never)