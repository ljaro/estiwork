#pragma once
#include "stdafx.h"
#include <boost\optional.hpp>
#include <boost\system\error_code.hpp>
#include <boost\asio\error.hpp>
#include <string>
#include <windows.h>
#include <queue>
#include <list>
#include <boost\thread.hpp>

#include "ProcessPath.h"
#include "Sample.h"
#include "IdleMeter.h"
#include "helperdef.h"

/// <summary>
/// Klasa funktor dla StateMachine
/// Jest odpowiedzialna za pobieranie za pomoca funkcji WinAPi informacji o oknach
/// </summary>
class Sampler
{
public:
	Sampler(void);
	~Sampler(void);
			// funkcja wywolywana cyklicznie.
	void operator()();
	std::deque<Sample> FetchSamples(const unsigned int count);
	void RemoveSamples(std::deque<Sample> for_remove);
	static Sample GetSample();
	bool GetIdleState();
private:
	static boost::optional<TString> GetWindowCaption(HWND handle);
	static ImagePaths GetWindowExePath(HWND handle);
	static TString GetWorkMode();

	std::deque<Sample> sample_stack;
	IdleMeter idlemeter_;

private:
	DISALLOW_COPY_AND_ASSIGN(Sampler);
};

