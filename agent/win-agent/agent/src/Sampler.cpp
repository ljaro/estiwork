#include "Sampler.h"
#include "SafeContainer.h"
#include <cstdlib>
#include <assert.h>
#include "../../thrift_gen/gen-cpp/da2dba_constants.h"

using namespace boost;
boost::mutex mutex1;

Sampler::Sampler(void):idlemeter_(1000, 120)
{
}


Sampler::~Sampler(void)
{
}

DWORD GetIdle()
{
	LASTINPUTINFO lif;
	lif.cbSize = sizeof(LASTINPUTINFO);
	GetLastInputInfo(&lif);
	return GetTickCount() - lif.dwTime;
}


void Sampler::operator()()
{
	//::system("cls");
//	std::cout << "sample:" << sample_stack.size() << std::endl;
	Sample sample = Sampler::GetSample();
	sample.idle = idlemeter_.GetIdleState();
	boost::mutex::scoped_lock lock(mutex1);

	std::string str = std::string("Sample:")+boost::posix_time::to_iso_extended_string(sample.probe_time_.get());
	//pantheios::log_INFORMATIONAL(str);

	assert(sample.probe_time_.is_initialized());
	sample_stack.push_back(sample);
	//Sleep(100000);
}

std::deque<Sample> Sampler::FetchSamples(const unsigned int count)
{
	boost::mutex::scoped_lock lock(mutex1);
	std::deque<Sample> fetched;
//	Sleep(100000);
	std::deque<Sample>::iterator iter = sample_stack.begin()+count;

	if (iter > sample_stack.end())
		iter = sample_stack.end();
	
	fetched.insert(fetched.begin(), sample_stack.begin(), iter);
	sample_stack.erase(sample_stack.begin(), iter);
	//fetched.splice(fetched.begin(), stack, iter, iter+count);
	return fetched;
}

void Sampler::RemoveSamples(std::deque<Sample> for_remove)
{
	sample_stack.erase(for_remove.begin(), for_remove.end());
}

Sample Sampler::GetSample()
{	
	HWND window_handle = GetForegroundWindow();
	optional<TString> window_caption = GetWindowCaption(window_handle);
	ImagePaths image_paths = GetWindowExePath(window_handle);
	TString work_mode = GetWorkMode();

	Sample sample;
	sample.image_fs_name_ = image_paths.image_fs_name;
	sample.image_full_path_ = image_paths.image_full_path;
	sample.resource_image_name_ = image_paths.resource_image_name;
	sample.probe_time_ = boost::posix_time::second_clock::universal_time();
	assert(sample.probe_time_.is_initialized());

	sample.window_handle_ = window_handle;
	sample.window_caption_ = window_caption;
	sample.work_mode = work_mode;

	return sample;
}

optional<TString> Sampler::GetWindowCaption(HWND handle)
{
	const int size = 1024;
	TCHAR wnd_text[size] = {0};
	
	::GetWindowText(handle,
					wnd_text, size);
	HRESULT hr = GetLastError();
	if(SUCCEEDED(hr))
		return boost::optional<TString>(TString(wnd_text));
	else
		return boost::optional<TString>();	
}

ImagePaths Sampler::GetWindowExePath(HWND handle)
{
	/*LPWSTR szName;
	szName = new WCHAR[MAX_PATH];
	wmemset(szName, L'\0', MAX_PATH);*/

	ImagePaths info;
	ZeroMemory(&info, sizeof(ImagePaths));

	FindWindowProcessModule(handle, &info);
	//std::wcout << info.path << std::endl;

	return info;
}


TString Sampler::GetWorkMode()
{
	return rpc::thrift::g_da2dba_constants.WORK_WITH_COMPUTER;
}