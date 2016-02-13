#pragma once
#include "helperdef.h"

class IdleMeter
{
public:
	/**
	 * Konstruktor.
	 * @param t Krok czasu co jaki odbywa sie probkowanie
	 * @note Klasa zapewnia odmierzanie czy w danym czasie probkowania t, wystepuje idlowanie. 
	 * Bierze pod uwage drobne aktywnosci i je ignoruje
 */
	IdleMeter(int t, int trashhold);
	~IdleMeter(void);

	bool GetIdleState();
private:
	bool lastidle_;
	unsigned long treshhold_;	
	unsigned long min_idle_;
	unsigned long active_time_;
	unsigned long t_;
	virtual unsigned long GetIdle();

	DISALLOW_COPY_AND_ASSIGN(IdleMeter);
};

