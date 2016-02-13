#pragma once

#include <string>
#include <wchar.h>

typedef std::basic_string<WCHAR> WString;
typedef std::basic_string<TCHAR> TString;
typedef std::basic_string<CHAR> AString;

inline WString ToUnicode(WString wsUnicode)
{return wsUnicode;}
WString ToUnicode(AString asAnsi);
AString ToAnsi(WString wsUnicode);
inline AString ToAnsi(AString asAnsi)
{return asAnsi;}

#ifdef _UNICODE
inline WString ToString(WString wsUnicode)
{return wsUnicode;}
inline WString ToString(AString asAnsi)
{return ToUnicode(asAnsi);}
#else
inline AString ToString(WString wsUnicode)
{return ToAnsi(wsUnicode);}
inline AString ToString(AString asAnsi)
{return asAnsi;}
#endif