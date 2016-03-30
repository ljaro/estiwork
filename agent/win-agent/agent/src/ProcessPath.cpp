

#include "ProcessPath.h"
#include <sstream>
#include <string>
#include <iomanip>
#include <iostream>
#include <tchar.h>

DWORD dwPID = -1;



BOOL CALLBACK EnumChildWindowsProc(HWND hWnd, LPARAM lParam)
{
	if(hWnd == (HWND)lParam)
	{
		GetWindowThreadProcessId(hWnd,&dwPID);
	}
	return TRUE;
}


BOOL CALLBACK EnumWindowsProc(HWND hWnd, LPARAM lParam)
{
	if(hWnd == (HWND)lParam)
	{
		GetWindowThreadProcessId(hWnd,&dwPID);
	}
	else
	{
		EnumChildWindows(hWnd,EnumChildWindowsProc,lParam);
	}
	return TRUE;
}

#pragma warning(disable : 4505 4710)
#pragma comment(lib, "version.lib")

 struct TRANSLATION {
 	WORD langID;   // language ID
 	WORD charset; // code page
 };



 struct StringTable { 
  WORD   wLength; 
  WORD   wValueLength; 
  WORD   wType; 
 // WCHAR  szKey[]; 
 // WORD   Padding[]; 
 // String Children[]; 
};


 // TODO GetFileVersionInfo uzywa sciezki do pliku. trzeba sprawdzic czy mozna uzyskac info z wgranego obrazu OpenProcess
 LPCTSTR GetOriginalFileName( LPCTSTR path )
 {
	

				
				BOOL fContinue;
				DWORD dwHandle = 0;
				DWORD dwInfoSize;
				LPVOID pvValue = 0;
				dwInfoSize = GetFileVersionInfoSize(path, &dwHandle);
				DWORD errCode = GetLastError();

				if (dwInfoSize!=0) // nie ma w ogole Info w pliku
				{
					unsigned char* InfoData = new unsigned char[dwInfoSize];
					GetFileVersionInfo(path, 0, dwInfoSize, InfoData);
					errCode = GetLastError();


					UINT uiSize = 0;

					TRANSLATION* trans;
					

				
					// Read the list of languages and code pages.

			


					fContinue = VerQueryValue(InfoData,
					_T("\\VarFileInfo\\Translation"),
					reinterpret_cast<LPVOID *>(&trans),
					&uiSize);

					uiSize++;

					errCode = GetLastError();

					if(errCode==0)
					{

							for(UINT i=0;i<(uiSize/sizeof(struct TRANSLATION));i++)
							{


										//std::wstringstream strsTemp;
										//std::stringstream strsTemp2;

										TCHAR tszVerStrName[228];
						
										
										wsprintf(tszVerStrName, 
											_T("\\StringFileInfo\\%04x%04x\\%s"),
											  trans[i].langID, trans[i].charset, _T("OriginalFilename")
											  );

										fContinue = VerQueryValue(InfoData,
											tszVerStrName,
											static_cast<LPVOID *>(&pvValue),
											&uiSize);

										errCode = GetLastError();

							}
					}


				//	std::wcout << static_cast<LPCWSTR>(pvValue) << std::endl;
					if (pvValue == 0)
						pvValue = L"\0";

					size_t len = _tcslen((LPCTSTR)pvValue);
					TCHAR* ret = new TCHAR[len+2];
					_tcscpy_s(ret, len+2, (LPCTSTR)pvValue);

					delete[] InfoData;
					return ret;
				}
				else
				{
					DWORD errCode = GetLastError();
				}

				LPTSTR tmp = new TCHAR[255];
				tmp[0] = _T('\0');
			//	delete[] InfoData;
				return static_cast<LPCTSTR>(tmp);
				
}




BOOL FindWindowProcessModule(HWND Hwnd, ImagePaths* info)
{
	EnumWindows(EnumWindowsProc,(LPARAM)Hwnd);
	if(-1 != dwPID)
	{
		HMODULE hModule = NULL;
		DWORD dwNeeded = NULL;
		HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ,FALSE,dwPID);
		if (NULL != hProcess)
		{
			if(EnumProcessModules(hProcess,&hModule,sizeof(hModule),&dwNeeded))
			{
				
				GetModuleBaseName(hProcess, hModule, info->image_fs_name, 255);

			/*	if( wcscmp(info->exeName, _T("tlen.exe") ) == 0 )
					DebugBreak();
*/
				GetModuleFileNameEx(hProcess,hModule, info->image_full_path, MAX_PATH);
				LPCTSTR ws = GetOriginalFileName(info->image_full_path);
				
				_tcscpy_s<255>(info->resource_image_name, ws);
				delete[] ws;
			}
			else
			{
				DWORD size = GetModuleBaseName(hProcess, hModule, info->image_fs_name, 255);
				if(size==0) info->image_fs_name[0] = '\0';
				GetProcessImageFileName(hProcess, info->image_full_path, MAX_PATH);
			}
			CloseHandle(hProcess);
		}
	}
	return NULL != info->image_full_path[0];
}



BOOL FindWindowProcessModule(HWND Hwnd, TCHAR *szName,size_t iMaxLen)
{
	EnumWindows(EnumWindowsProc,(LPARAM)Hwnd);
	if(-1 != dwPID)
	{
		HMODULE hModule = NULL;
		DWORD dwNeeded = NULL;
		HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ,FALSE,dwPID);
		if (NULL != hProcess)
		{
			if(EnumProcessModules(hProcess,&hModule,sizeof(hModule),&dwNeeded))
			{
				GetModuleFileNameEx(hProcess,hModule,szName, (DWORD)iMaxLen);
			}
			else
			{
				GetProcessImageFileName(hProcess,szName, (DWORD)iMaxLen);
			}
			CloseHandle(hProcess);
		}
	}
	return NULL != szName[0];
}
