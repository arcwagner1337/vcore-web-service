#pragma once
#include "oatpp/web/server/HttpRouter.hpp"




#include OATPP_CODEGEN_BEGIN(DTO) 

class UserHwidDto : public oatpp::DTO {
	DTO_INIT(UserHwidDto, DTO)
		DTO_FIELD(Int32, user_id);
	DTO_FIELD(String, hwid);
};

#include OATPP_CODEGEN_END(DTO)