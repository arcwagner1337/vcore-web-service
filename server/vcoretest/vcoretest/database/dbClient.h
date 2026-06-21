#pragma once
#include "oatpp-postgresql/orm.hpp"




#include OATPP_CODEGEN_BEGIN(DbClient)

class MyDbClient : public oatpp::orm::DbClient
{
public:
	MyDbClient(const std::shared_ptr<oatpp::orm::Executor>& executor)
		: oatpp::orm::DbClient(executor)
	{
		
		executeQuery("CREATE TABLE IF NOT EXISTS users ("
			"id SERIAL PRIMARY KEY, "
			"name TEXT UNIQUE, "
			"password TEXT, "
			"email TEXT, "
			"sub_start BIGINT, " 
			"sub_end BIGINT"	  
			");",
			{});

		executeQuery("CREATE TABLE IF NOT EXISTS password_resets ("
			"id SERIAL PRIMARY KEY, "
			"email VARCHAR(255) NOT NULL, "
			"code VARCHAR(6) NOT NULL, "
			"expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes' "
			");",
			{});

		executeQuery("CREATE TABLE IF NOT EXISTS pending_registrations ("
			"id SERIAL PRIMARY KEY, "
			"username TEXT NOT NULL, "
			"email TEXT NOT NULL, "
			"password TEXT NOT NULL, "
			"code VARCHAR(6) NOT NULL, "
			"expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes' "
			");",
			{});

		executeQuery("CREATE TABLE IF NOT EXISTS user_hwid ("
			"user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, "
			"hwid TEXT, "
			"updated_at BIGINT"
			");", {});
	}

	QUERY(getUserByName, "SELECT * FROM users WHERE name=:name LIMIT 1;", PARAM(oatpp::String, name))

		QUERY(getUserByIdentifier,
			"SELECT * FROM users WHERE name=:id OR email=:id LIMIT 1;",
			PARAM(oatpp::String, id))
		QUERY(createUser, "INSERT INTO users (name, password, email, sub_start, sub_end) VALUES (:name, :pass, :email, :start, :end) RETURNING id;",
			PARAM(oatpp::String, name), PARAM(oatpp::String, pass), PARAM(oatpp::String, email), PARAM(oatpp::Int64, start), PARAM(oatpp::Int64, end))

		QUERY(updateUserSubFull,
			"UPDATE users SET sub_start = :start_val, sub_end = :end_val WHERE name = :name;",
			PARAM(oatpp::Int64, start_val),
			PARAM(oatpp::Int64, end_val),
			PARAM(oatpp::String, name))

		QUERY(updateUserProfile,
			"UPDATE users "
			"SET name = :new_name, "
			"    email = :new_email, "
			"    password = :new_pass "
			"WHERE name = :current_name;",
			PARAM(oatpp::String, new_name),
			PARAM(oatpp::String, new_email),
			PARAM(oatpp::String, new_pass),
			PARAM(oatpp::String, current_name))



		QUERY(clearOldCodes,
			"DELETE FROM password_resets WHERE email=:email;",
			PARAM(oatpp::String, email))

		QUERY(insertNewCode,
			"INSERT INTO password_resets (email, code) VALUES (:email, :code);",
			PARAM(oatpp::String, email), PARAM(oatpp::String, code))

		QUERY(getResetCode,
			"SELECT COUNT(*) FROM password_resets WHERE email=:email AND code=:code AND expires_at > CURRENT_TIMESTAMP;",
			PARAM(oatpp::String, email), PARAM(oatpp::String, code))

		QUERY(deleteResetCode,
			"DELETE FROM password_resets WHERE email=:email;",
			PARAM(oatpp::String, email))

		QUERY(checkUserByEmail,
			"SELECT COUNT(*) as count FROM users WHERE email=:email;",
			PARAM(oatpp::String, email))

		QUERY(clearPendingRegistration,
			"DELETE FROM pending_registrations WHERE username=:name OR email=:email;",
			PARAM(oatpp::String, name), PARAM(oatpp::String, email))

	
		QUERY(insertPendingRegistration,
			"INSERT INTO pending_registrations (username, email, password, code) VALUES (:name, :email, :pass, :code);",
			PARAM(oatpp::String, name), PARAM(oatpp::String, email), PARAM(oatpp::String, pass), PARAM(oatpp::String, code))



		QUERY(getPendingRegistration,
			"SELECT email, password FROM pending_registrations WHERE username=:username AND code=:code LIMIT 1",
			PARAM(oatpp::String, username), PARAM(oatpp::String, code))
		QUERY(deletePendingRegistration,
			"DELETE FROM pending_registrations WHERE username=:name AND code=:code;",
			PARAM(oatpp::String, name), PARAM(oatpp::String, code))
		
		
		QUERY(getUserHwid,
			"SELECT hwid FROM user_hwid WHERE user_id = :id;",
			PARAM(oatpp::Int32, id))

		QUERY(setUserHwid,
			"INSERT INTO user_hwid (user_id, hwid, updated_at) VALUES (:id, :hwid, :now);",
			PARAM(oatpp::Int32, id),
			PARAM(oatpp::String, hwid),
			PARAM(oatpp::Int64, now))


		QUERY(getUserSubscription,
			"SELECT id, sub_end FROM users WHERE name = :username;",
			PARAM(oatpp::String, username))






};

#include OATPP_CODEGEN_END(DbClient)