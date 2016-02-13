#include "DatabaseInterface.h"
#include <ctime>




DatabaseInterface::DatabaseInterface()// : db(NULL)
{
	//int result = sqlite3_open_v2("buffer.db", &db, SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE, NULL);

	if (0)
	{
		pantheios::log_CRITICAL("database open error");
	}
	else
	{
		pantheios::log_DEBUG("database opened succesfull");
		setupDatabase();
	}
}

void DatabaseInterface::setupDatabase()
{
	//char *zErrMsg = 0;
	//char* sql = 
	//	"CREATE TABLE if not exists MESSAGES("  \
	//	"ID					INTEGER PRIMARY KEY AUTOINCREMENT     NOT NULL," \
	//	"TYPE				INTEGER					NOT NULL," \
	//	"CREATE_DATE        INTEGER					NOT NULL," \
	//	"STATE				INTEGER," \
	//	"RAW_DATA			BLOB );";
	//int result = sqlite3_exec(db, sql, NULL, 0, &zErrMsg);

	//if (result != SQLITE_OK)
	//{
	//	pantheios::log_ERROR("create database fail, ", zErrMsg);
	//}
}


DatabaseInterface::~DatabaseInterface()
{
	//if (db != NULL)
	//{
	//	pantheios::log_DEBUG("database closing");
	//	sqlite3_close(db);
	//}
}

void DatabaseInterface::write(const uint8_t* data, uint32_t size)
{	

	//sqlite3_stmt * stmt;
	//char *zErrMsg = 0;
	//char* sql =
	//	"INSERT INTO MESSAGES (TYPE, CREATE_DATE, STATE, RAW_DATA) VALUES(?,?,?,?)";


	//CALL_SQLITE(prepare_v2(db, sql, strlen(sql) + 1, &stmt, NULL));
	//CALL_SQLITE(bind_int(stmt, 1, 1));
	//CALL_SQLITE(bind_int(stmt, 2, 0));
	//CALL_SQLITE(bind_int(stmt, 3, 0)); // 0-NEW, 1-PENDING, 2-FOR DELETE
	//CALL_SQLITE(bind_blob(stmt, 4, data, size, SQLITE_TRANSIENT)); // 0-NEW, 1-PENDING, 2-FOR DELETE
	//CALL_SQLITE_EXPECT(step(stmt), DONE);
}

void DatabaseInterface::write(std::string data)
{

	//const char* byteArray = data.data();
	//size_t byteArraySize = data.size();

	//sqlite3_stmt * stmt;
	//char *zErrMsg = 0;
	//char* sql =
	//	"INSERT INTO MESSAGES (TYPE, CREATE_DATE, STATE, RAW_DATA) VALUES(?,?,?,?)";
	//

	//CALL_SQLITE(prepare_v2(db, sql, strlen(sql) + 1, &stmt, NULL));
	//CALL_SQLITE(bind_int(stmt, 1, 1));
	//CALL_SQLITE(bind_int(stmt, 2, 0));
	//CALL_SQLITE(bind_int(stmt, 3, 0)); // 0-NEW, 1-PENDING, 2-FOR DELETE
	//CALL_SQLITE(bind_blob(stmt, 4, byteArray, byteArraySize, SQLITE_TRANSIENT)); // 0-NEW, 1-PENDING, 2-FOR DELETE
	//CALL_SQLITE_EXPECT(step(stmt), DONE);
}