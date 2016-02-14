#include "GlobalFunctions.h"
#include <windows.h>
#include <Sddl.h>
#include <iostream>
#include <tchar.h>
#include <pantheios/pantheios.hpp> //primary header file, always be included
#include <pantheios/frontends/stock.h>
#include <pantheios/inserters/integer.hpp>
//#include <pantheios/implicit_link/be.WindowsConsole.h>

//Specify process identity
const PAN_CHAR_T PANTHEIOS_FE_PROCESS_IDENTITY [] = "test.exe";


bool GetActiveConsoleSessionId(DWORD& session_id)
{
	//TODO obsluga bledow
	//TODO zamienic sprawdzanie system w runtime, albo pomyslec o wersjach programu dla roznych systemow
	

	#if _WIN32_WINNT == 0x0500 
	session_id = 0;
	#else
	session_id = WTSGetActiveConsoleSessionId();
	#endif

	return  (session_id != 0xFFFFFFFF);
}

// Simple clean up routine
void Cleanup(PTOKEN_GROUPS ptgrp)
{
	// Release the buffer for the token groups.
	if(ptgrp != NULL)
	{		
		pantheios::log_DEBUG("Freeing up the ptgrp buffer...\n");
		HeapFree(GetProcessHeap(), 0, (LPVOID)ptgrp);
	}
	else
	{
		pantheios::log_DEBUG("ptgrp buffer has been freed-up!\n");
	}
}

// Simple clean up routine
void Cleanup(PTOKEN_USER ptgrp)
{
	// Release the buffer for the token groups.
	if(ptgrp != NULL)
	{		
		pantheios::log_DEBUG("Freeing up the ptgrp buffer...");
		HeapFree(GetProcessHeap(), 0, (LPVOID)ptgrp);
	}
	else
	{
		pantheios::log_DEBUG("ptgrp buffer has been freed-up!");		
	}
}


// Get the logon SID and convert it to SID string...
BOOL GetUserSID(HANDLE hToken, PSID& ppsid)
{
	BOOL bSuccess = FALSE;
	PTOKEN_USER ptgrp = NULL;
	GetToken<TOKEN_USER>(hToken, ptgrp, TokenUser);
	if(!CopySID(ptgrp->User.Sid, ppsid))
	{
		Cleanup(ptgrp);
	}
	
	// Verify the parameter passed in is not NULL.
	// Although we just provide an empty buffer...
	if(ppsid == NULL)
	{		
		pantheios::log_DEBUG("The ppsid pointer is NULL lol!");
		Cleanup(ptgrp);
	}
	else
	{		
		pantheios::log_DEBUG("The ppsid pointer is valid");
	}



	//		LocalFree(pSid);
	// If everything OK, returns a clean slate...
	bSuccess = TRUE;
	return bSuccess;
}

// The following function release the buffer allocated by the GetLogonSID() function.
BOOL FreeLogonSID(PSID* ppsid)
{
	HeapFree(GetProcessHeap(), 0, (LPVOID)*ppsid);
	return TRUE;
}

bool ConvertSIDToString(PSID ppsid, TString& ssid)
{

	LPTSTR pSid = _T("");
	// Convert the logon sid to SID string format
	if(!(ConvertSidToStringSid(
		ppsid,  // Pointer to the SID structure to be converted
		&pSid))) // Pointer to variable that receives the null-terminated SID string
	{				
		pantheios::log_DEBUG("ConvertSidToStringSid() failed, error ", pantheios::integer(GetLastError()));
	}
	else
	{
		//wprintf(L"ConvertSidToStringSid() is OK.\n");
		//wprintf(L"The logon SID string is: %s\n", pSid);
		ssid = TString(pSid);
	}
	LocalFree(pSid);
	return true;
}

template <class T>
bool GetToken(HANDLE hToken, T*& pToken, _TOKEN_INFORMATION_CLASS tokenClass)
{
	bool bSuccess = FALSE;
	DWORD dwLength = 0;


	// Get the required buffer size and allocate the TOKEN_GROUPS buffer.
	if(!GetTokenInformation(
		hToken,               // handle to the access token
		tokenClass,    // get information about the token's groups
		(LPVOID) pToken, // pointer to TOKEN_GROUPS buffer
		0,                         // size of buffer
		&dwLength        // receives required buffer size
		))
	{
		if(GetLastError() != ERROR_INSUFFICIENT_BUFFER)
		{
			pantheios::log_DEBUG("GetTokenInformation() - buffer is OK!");
			Cleanup(pToken);
		}
		else
		{
			pantheios::log_DEBUG("Not enough buffer, re-allocate...");
			pToken = (T*)HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, dwLength);
		}

		if(pToken == NULL)
		{
			pantheios::log_DEBUG("Failed to allocate heap for ptgrp, error %u", pantheios::integer(GetLastError()));
			Cleanup(pToken);
		}
		else
		{
			pantheios::log_DEBUG("Well, buffer for ptgrp has been allocated!");
		}
	}
	else
	{
		pantheios::log_DEBUG("GetTokenInformation() is pretty fine!");
	}

	// Get the token group information from the access token.
	if(!GetTokenInformation(
		hToken,         // handle to the access token
		tokenClass,    // get information about the token's groups
		(LPVOID) pToken, // pointer to TOKEN_GROUPS buffer
		dwLength,       // size of buffer
		&dwLength       // receives required buffer size
		))
	{
		pantheios::log_DEBUG("GetTokenInformation()  failed, error %u", pantheios::integer(GetLastError()));
		Cleanup(pToken);
	}
	else
	{
		pantheios::log_DEBUG("GetTokenInformation() - got the token group information!");
	}


	return bSuccess;
}


//extern "C"
//{
//#ifdef WIN32
//#include <Rpc.h>
//#else
//#include <uuid/uuid.h>
//#endif
//}


std::string newUUID()
{
#ifdef WIN32
	UUID uuid;
	UuidCreate ( &uuid );

	unsigned char * str;
	UuidToStringA ( &uuid, &str );

	std::string s( ( char* ) str );

	RpcStringFreeA ( &str );
#else
	uuid_t uuid;
	uuid_generate_random ( uuid );
	char s[37];
	uuid_unparse ( uuid, s );
#endif
	return s;
}

bool CopySID( PSID& from, PSID& to )
{
	DWORD dwLength = 0;
	// If the logon SID is found then make a copy of it.
	dwLength = GetLengthSid(from);
	// Allocate a storage
	pantheios::log_DEBUG("Allocating heap for ppsid...");
	to = (PSID) HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, dwLength);
	// and verify again...


	// If Copying the SID fails...
	if(!CopySid(dwLength,
		to,    // Destination
		from))  // Source
	{
		pantheios::log_DEBUG("Failed to copy the SID, error %u", pantheios::integer(GetLastError()));
		HeapFree(GetProcessHeap(), 0, (LPVOID)to);
		return false;
	}
	else
	{
		pantheios::log_DEBUG("The SID was copied successfully!");
		return true;
	}


}
