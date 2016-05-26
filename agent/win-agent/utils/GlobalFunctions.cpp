#include "GlobalFunctions.h"
#include <windows.h>
#include <Sddl.h>
#include <iostream>
#include <tchar.h>
#include <boost\log\trivial.hpp>

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
		HeapFree(GetProcessHeap(), 0, (LPVOID)ptgrp);
	}
}

// Simple clean up routine
void Cleanup(PTOKEN_USER ptgrp)
{
	// Release the buffer for the token groups.
	if(ptgrp != NULL)
	{				
		HeapFree(GetProcessHeap(), 0, (LPVOID)ptgrp);
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
		//pantheios::log_CRITICAL("The ppsid pointer is NULL lol!");
		Cleanup(ptgrp);
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
		BOOST_LOG_TRIVIAL(error) << "ConvertSidToStringSid() failed, error " << GetLastError();
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
#ifdef LOG_BUFFER_ALLOC_TRY
			pantheios::log_DEBUG("GetTokenInformation() - buffer is OK!");
#endif
			Cleanup(pToken);
		}
		else
		{			
#ifdef LOG_BUFFER_ALLOC_TRY
			pantheios::log_DEBUG("Not enough buffer, re-allocate...");
#endif
			pToken = (T*)HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, dwLength);
		}

		if(pToken == NULL)
		{			
			BOOST_LOG_TRIVIAL(fatal) << "Failed to allocate heap for ptgrp, error " << GetLastError();
			Cleanup(pToken);
		}
		else
		{
#ifdef LOG_BUFFER_ALLOC_TRY
			pantheios::log_DEBUG("Well, buffer for ptgrp has been allocated!");
#endif
		}
	}
	else
	{
#ifdef LOG_BUFFER_ALLOC_TRY
		pantheios::log_DEBUG("GetTokenInformation() is pretty fine!");
#endif
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
		BOOST_LOG_TRIVIAL(fatal) << "GetTokenInformation()  failed, error " << GetLastError();
		Cleanup(pToken);
	}
	else
	{
#ifdef LOG_BUFFER_ALLOC_TRY
		pantheios::log_DEBUG("GetTokenInformation() - got the token group information!");
#endif
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
	to = (PSID) HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, dwLength);
	// and verify again...


	// If Copying the SID fails...
	if(!CopySid(dwLength,
		to,    // Destination
		from))  // Source
	{		
		BOOST_LOG_TRIVIAL(debug) << "Failed to copy the SID, error " << GetLastError();
		HeapFree(GetProcessHeap(), 0, (LPVOID)to);
		return false;
	}	
}
