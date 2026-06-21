#pragma once
#include "oatpp/web/server/HttpRouter.hpp"




#include OATPP_CODEGEN_BEGIN(DTO) 

class UserDto : public oatpp::DTO
{
	DTO_INIT(UserDto, DTO)
		DTO_FIELD(Int32, id);
	DTO_FIELD(String, name);
	DTO_FIELD(String, password);
	DTO_FIELD(String, email);
	DTO_FIELD(Int64, sub_start);
	DTO_FIELD(Int64, sub_end);
};

class UserCountDto : public oatpp::DTO
{
	DTO_INIT(UserCountDto, DTO)
		DTO_FIELD(Int32, count);
};

class PendingUser : public oatpp::DTO
{
	DTO_INIT(PendingUser, DTO)
		DTO_FIELD(Int32, id);
	DTO_FIELD(String, email);
	DTO_FIELD(String, password);
	DTO_FIELD(String, username);
	DTO_FIELD(String, code);	   
	DTO_FIELD(String, expires_at);
};




#include OATPP_CODEGEN_END(DTO)