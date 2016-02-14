
#pragma once

#include <windows.h>
#include <psapi.h>
#include <iostream>
#pragma comment(lib, "psapi")


struct ImagePaths
{
	TCHAR image_fs_name[255]; // nazwa pliku exe jaka jest w systemie plikow
	TCHAR image_full_path[MAX_PATH]; // pelna sciezka do pliku exe
	TCHAR resource_image_name[255]; // nazwa pliku znajdujaca sie w zasobach pliku
};

BOOL FindWindowProcessModule(HWND Hwnd, TCHAR *szName,size_t iMaxLen);
BOOL FindWindowProcessModule(HWND Hwnd, ImagePaths* info);
LPCTSTR GetOriginalFileName(LPCTSTR path);