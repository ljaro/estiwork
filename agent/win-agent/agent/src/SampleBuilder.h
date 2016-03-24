#pragma once
#include "stdafx.h"
#include "Sample.h"
#include "Sampler.h"
#include "Hasher.h"
#include "MessageSender.h"
#include <boost\thread.hpp>
#include <boost\date_time.hpp>
#include "helperdef.h"
#include <boost\asio\io_service.hpp>
//#define LOG_SAMPLEGROUPING

// TODO: zauwzylem ze jest tu uzyty sampler i metoda wyciagania sampli. ale lepiej byloby zeby sampler byl tylko funktorem a reszta funkcji prywatne
/// <summary>
/// Klasa zajmujaca sie odbieraniem informacji skladowanych w Samplerze 
/// i odpowiednie grupowanie i scalanie danych.
/// </summary>
class SampleBuilder
{
public:
	SampleBuilder(Sampler& sampler, MessageSender& sender);
	~SampleBuilder(void);
private:
	boost::asio::io_service& io_processor;
	Sampler& sampler_;
	MessageSender& sender_;
	Hasher hasher;
	boost::thread* fetch_thread;
	std::deque<Sample> sample_stack;	
	std::deque<SampleMessage> sample_stack_for_send;
	bool thread_terminated_;
	void thread_main();
	std::deque<Sample> GroupStack(std::deque<Sample>& stack);
	SampleMessage GroupMerge(std::deque<Sample>& stack);

	virtual bool IsSameSampleTest(Sample& a, Sample& b);

private:
	DISALLOW_COPY_AND_ASSIGN(SampleBuilder);
};

