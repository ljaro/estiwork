#include "UserSid.h"
#include "GlobalFunctions.h"
#include <pantheios/pantheios.hpp> //primary header file, always be included
#include <pantheios/inserters/integer.hpp>

UserSid::UserSid(void)
{
}


UserSid::~UserSid(void)
{
}

//TODO pobieranie SID do testowania
std::string UserSid::GetUserSID()
{
	HANDLE hToken;
	if (!OpenProcessToken( GetCurrentProcess(), TOKEN_ALL_ACCESS, &hToken )) 
	{		
		pantheios::log_ERROR("OpenProcessToken Error GetLastError=", pantheios::integer(GetLastError()));
		return FALSE;
	}
	//BYTE sidBuffer[256];
	PSID ppsid = NULL;
	::GetUserSID(hToken, ppsid);

	std::string strsid;
	ConvertSIDToString(ppsid, strsid);

	CloseHandle(hToken);

	return strsid;
}
