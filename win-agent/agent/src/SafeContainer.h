#pragma once
#include <boost\thread.hpp>

template <class T>
class SafeContainer
{
public:
	explicit SafeContainer(T&t):t_(t)
	{
	}

	~SafeContainer(void)
	{
		mutex1.unlock();
	}

	T& Get()
	{
		mutex1.lock();
		return t_;
	}

	void UnLock()
	{
		mutex1.lock();
	}
private:
	boost::mutex mutex1;
	T& t_;
};

/*

SafeContainer<std::queue>(queue)

*/