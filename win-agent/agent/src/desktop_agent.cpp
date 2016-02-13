// DesktopAgent.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "StateMachine.h"
#include "Sampler.h"
#include "SampleBuilder.h"
#include <boost\asio\io_service.hpp>
//#include <vld.h>
//#pragma comment(lib, "libtcmalloc_minimal-debug")


//#pragma comment(lib, "pantheios.1.be.WindowsConsole.vc10.mt.debug.lib")
#pragma comment(lib, "pantheios.1.core.vc10.mt.debug.lib")
#pragma comment(lib, "pantheios.1.util.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.fe.null.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.fe.all.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.bec.file.vc10.mt.debug.lib")
//#pragma comment(lib, "pantheios.1.be.file.vc10.mt.debug.lib")

//extern "C" const char PANTHEIOS_FE_PROCESS_IDENTITY[] = "MyApplication";

namespace
{
	static int s_log_level = pantheios::debug;
}

PANTHEIOS_CALL(int) pantheios_fe_isSeverityLogged(void *token,
	int severity, int backEndId)
{
	return severity <= s_log_level;
}


PANTHEIOS_CALL(int) pantheios_fe_init(void    * /* reserved */
	, void    **ptoken)
{
	*ptoken = NULL;

	return 0;
}

PANTHEIOS_CALL(void) pantheios_fe_uninit(void * /* token */)
{}

PANTHEIOS_CALL(char const*) pantheios_fe_getProcessIdentity(void * /* token */)
{
	return "example_cpp_custom_fe";
}




int _tmain(int argc, _TCHAR* argv[])
{


	if (argc > 1)
	{
		s_log_level = atoi(argv[1]);
	}

	boost::asio::io_service ios;
	Sampler s;
	MessageSender sender;
	SampleBuilder sb(s, sender);
	StateMachine<Sampler> sm(ios, s);
	sm.start();

	return 0;
}

