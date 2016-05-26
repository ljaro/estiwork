// DesktopAgent.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "StateMachine.h"
#include "Sampler.h"
#include "SampleBuilder.h"
#include <boost\bind.hpp>
#include <boost\asio\io_service.hpp>
#include <boost\date_time\posix_time\posix_time.hpp>
#include <boost\thread.hpp>

using namespace boost;
using namespace boost::asio;

io_service ios;



int _tmain(int argc, _TCHAR* argv[])
{
	io_service main_io;
	io_service::work dummy_work(main_io);

	Sampler sampler;
	MessageSender sender;
	SampleBuilder sb(sampler, sender);
	StateMachine<Sampler> sm(main_io, sampler);

	main_io.run();

	return 0;
}

