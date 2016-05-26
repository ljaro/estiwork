#include "UserSid.h"
#include "GlobalFunctions.h"
#include <boost\log\trivial.hpp>

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
		BOOST_LOG_TRIVIAL(error) << "OpenProcessToken Error GetLastError=" << GetLastError();
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
