#pragma once
#include <string>

class WindowsLocalUser
{
public:
	WindowsLocalUser();
	~WindowsLocalUser();

	std::string name;

private:
	std::string GetThisUserName();
};

