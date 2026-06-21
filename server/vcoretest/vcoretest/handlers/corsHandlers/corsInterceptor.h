#pragma once
#include "oatpp/web/server/HttpConnectionHandler.hpp"


class CorsInterceptor : public oatpp::web::server::interceptor::RequestInterceptor
{
public:
	std::shared_ptr<OutgoingResponse> intercept(const std::shared_ptr<IncomingRequest>& request) override
	{

	
		if (request->getStartingLine().method == "OPTIONS")
		{
			auto response = oatpp::web::protocol::http::outgoing::ResponseFactory::createResponse(
				oatpp::web::protocol::http::Status::CODE_204, "");

		

			auto origin = request->getHeader("Origin");
			if (origin) {
				std::string o = origin->c_str();
			
				if (o == "http://localhost:3000" || o == "http://localhost") {
					response->putHeader("Access-Control-Allow-Origin", o.c_str());
				}
			}

			response->putHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			response->putHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
			response->putHeader("Access-Control-Allow-Credentials", "true");
			response->putHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Device-ID");

			return response; 
		}

		return nullptr; 
	}
};