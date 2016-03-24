#pragma once
#define WIN32_LEAN_AND_MEAN
#include <boost\optional.hpp>
#include <boost\serialization\optional.hpp>
#include <boost\date_time.hpp>
#include <string>
#include <Windows.h>
#include "../../encoding.h"

struct Sample
{

	boost::optional<TString> window_caption_;
	// nazwa pliku exe jaka jest w systemie plikow
	// pelna sciezka do pliku exe
	// nazwa pliku znajdujaca sie w zasobach pliku
	boost::optional<TString> image_fs_name_, image_full_path_, resource_image_name_;

	// data probkowania
	boost::optional<boost::posix_time::ptime> probe_time_;

	// HASH pliku exe
	boost::optional<TString> hash_; // niekoniecznie to musi byc wstring

	// uchwyt okna
	HWND window_handle_;

	bool idle; // czy idluje w danym okresie probkowania

	static int id;


	int sample_id_;

	TString work_mode;
};

