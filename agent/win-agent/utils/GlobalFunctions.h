#pragma once
#include <Windows.h>
#include <string>
#include <rpc.h>
#include "../encoding.h"

bool GetActiveConsoleSessionId(DWORD& session_id);

std::string newUUID();

BOOL GetUserSID(HANDLE hToken, PSID& ppsid);
BOOL FreeLogonSID(PSID* ppsid);
void Cleanup(PTOKEN_GROUPS ptgrp);
void Cleanup(PTOKEN_USER ptgrp);
bool ConvertSIDToString(PSID ppsid, std::string& ssid);
bool CopySID(PSID& from, PSID& to);
template <class T> bool GetToken(HANDLE hToken, T*& pToken, _TOKEN_INFORMATION_CLASS tokenClass);