#include "Hasher.h"
#include <openssl\sha.h>
#include <boost/iostreams/device/mapped_file.hpp>
#include <sstream>

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

bool Hasher::simpleHash(void* input, unsigned long length, unsigned char* md)
{
    SHA256_CTX context;
    if(!SHA256_Init(&context))
        return false;

    if(!SHA256_Update(&context, (unsigned char*)input, length))
        return false;

    if(!SHA256_Final(md, &context))
        return false;

    return true;
}

bool Hasher::getHash(const TString& path, TString& out)
{
	try
	{
		boost::iostreams::mapped_file_source mf(path);

		if(mf.is_open())
		{
			unsigned char result[SHA_DIGEST_LENGTH];
			size_t size = mf.size();
			const unsigned char* start = reinterpret_cast<const unsigned char*>(mf.data());
			SHA1(start, size,  result);		
			mf.close();
			out = reinterpret_cast<const char*>(result);

			std::stringstream ss;

			for(int i=0;i<SHA_DIGEST_LENGTH;i++)
			{
				ss << std::hex << (int)result[i];
			}

			out = ss.str();
			pantheios::log_INFORMATIONAL("sha1 of ", path, " ", out);

			return true;
		}	
	}
	catch(...)
	{
		return false;
	}

	return false;
}