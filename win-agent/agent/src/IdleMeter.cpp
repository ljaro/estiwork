#include "IdleMeter.h"
#include <Windows.h>

IdleMeter::IdleMeter(int t, int trashhold):
	t_(t), 
	lastidle_(0), 
	treshhold_(trashhold), 
	min_idle_(1200)
{
}


IdleMeter::~IdleMeter(void)
{
}

bool IdleMeter::GetIdleState()
{
	DWORD idle_time = GetIdle();

	bool is_idle = idle_time>treshhold_;
	
	if(is_idle)
	{
		active_time_ = 0;
		lastidle_ = is_idle;
		return is_idle;
	}
	else
	{
		
		active_time_+=t_;
		if(active_time_<=min_idle_ && lastidle_)
		{
			lastidle_ = true;
			return true;
		}
		else
		{
			lastidle_ = false;
			return false;
		}
	}


}

DWORD IdleMeter::GetIdle()
{
	LASTINPUTINFO lif;
	lif.cbSize = sizeof(LASTINPUTINFO);
	GetLastInputInfo(&lif);

	DWORD tick = GetTickCount();
	return tick - lif.dwTime;
}
