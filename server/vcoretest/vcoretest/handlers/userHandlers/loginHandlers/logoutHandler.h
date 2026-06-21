#pragma once
#include "oatpp/web/server/HttpRouter.hpp"




class LogoutHandler : public oatpp::web::server::HttpRequestHandler
{
public:
	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{
		auto response = ResponseFactory::createResponse(Status::CODE_200, "{\"status\":\"logged_out\"}");

		
		response->putHeader("Set-Cookie", "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
		response->putHeader("Access-Control-Allow-Origin", "http://localhost");
		response->putHeader("Access-Control-Allow-Credentials", "true");

		return response;
	}
};