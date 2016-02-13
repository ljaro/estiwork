#pragma once
#include "stdafx.h"
#include <string>
#include <stdint.h>
//#include "../sqlite3lib/sqlite3.h"




class DatabaseInterface
{
public:
	DatabaseInterface();
	~DatabaseInterface();

	void write(std::string data);
	void write(const uint8_t* data, uint32_t size);
private:
	void setupDatabase();
//	sqlite3* db;
};

