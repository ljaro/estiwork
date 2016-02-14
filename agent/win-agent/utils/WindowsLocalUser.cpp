#include "WindowsLocalUser.h"
#include <tchar.h>
#include <windows.h>

WindowsLocalUser::WindowsLocalUser()
{
	name = this->GetThisUserName();
}


WindowsLocalUser::~WindowsLocalUser()
{
}

std::string WindowsLocalUser::GetThisUserName()
{

	TCHAR buff[255];
	DWORD size = 255;
	bool result = ::GetUserName(buff, &size);
	if (result)
		return std::string(buff);
	//TODO throw albo cos w przypadku bledu
}