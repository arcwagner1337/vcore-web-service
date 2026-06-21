#pragma once


#include "oatpp/web/server/HttpRouter.hpp"




#include OATPP_CODEGEN_BEGIN(DTO) 

class AuthDto : public oatpp::DTO
{
	DTO_INIT(AuthDto, DTO)
		DTO_FIELD(String, name);
	DTO_FIELD(String, password);
};



#include OATPP_CODEGEN_END(DTO)