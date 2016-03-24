#include "Hasher.h"


Hasher::Hasher(void)
{
}


Hasher::~Hasher(void)
{
}

void Hasher::fillHash(SampleMessage& sample)
{
	if(sample.sample.image_full_path_.is_initialized())
	{
		TString file_name = sample.sample.image_full_path_.get();
		TString hash;
		if(getHash(file_name, hash))
		{						
			sample.sample.hash_ = hash;
		}
		else
		{
			pantheios::log_ERROR("In Hasher - hashing failed");
		}
	}
	else
	{
		pantheios::log_ERROR("In Hasher - image path not found, hashing aborted");
	}
}

bool Hasher::getHash(const TString& path, TString& out)
{
	out = "this is hash";
	return true;
}