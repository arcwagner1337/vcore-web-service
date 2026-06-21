#pragma once
#include "oatpp/web/server/HttpRouter.hpp"



class StatusHandler : public oatpp::web::server::HttpRequestHandler
{
public:
	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{
		json response_data = {
			{"status", "active"},
			{"version", "1.0.0-alpha"} };


		auto response = ResponseFactory::createResponse(Status::CODE_200, response_data.dump().c_str());


		response->putHeader("Access-Control-Allow-Origin", "*");
		response->putHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		response->putHeader("Access-Control-Allow-Headers", "*");

		return response;
	}
};