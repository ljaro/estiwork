#pragma once
#include <string>
//#pragma comment(lib, "advapi32.lib")

class UserSid
{
public:
	UserSid(void);
	~UserSid(void);

	static std::string GetUserSID();
};

