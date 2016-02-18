#pragma once

#include <boost\asio.hpp>
#include <boost\bind.hpp>
#include <boost\system\error_code.hpp>
#include <boost\asio\error.hpp>
#include "helperdef.h"

using namespace boost;

//
//void operator()(
//      const asio::error_code& ec)
//  {
//    ...
//  }



/// <summary>
/// Klasa ma za zadnie wywolywac cyklicznie funktor z operatorem void operator()(); 
/// </summary>
template <typename T>
class StateMachine
{
public:
	StateMachine(asio::io_service& ios, T & handler):
	ios_(ios), 
	timer_(ios_, boost::posix_time::seconds(0)), 
	handler_(handler)
	{
		reset();
	}

	~StateMachine(void)
	{
	}

	void start()
	{
		ios_.run();
	}

	void stop()
	{
		ios_.stop();
	}

	void suspend()
	{
	}

private:
	asio::io_service& ios_;
	asio::deadline_timer timer_;
	T& handler_;

	void reset()
	{
		timer_.expires_from_now(boost::posix_time::milliseconds(50));
		timer_.async_wait(boost::bind(&StateMachine::internal_handler, this));
	}

	void internal_handler()
	{
		handler_();
		reset();
	}

private:
	DISALLOW_COPY_AND_ASSIGN(StateMachine);
};

