#pragma once
#include "../../../database/dbClient.h"
#include "../../../dtos/userDto.h"
#include "oatpp/web/server/HttpRouter.hpp"
#include <nlohmann/json.hpp>
using json = nlohmann::json;
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"


class LoginHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;

public:
	LoginHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{

		auto body = request->readBodyToString();
		auto j = nlohmann::json::parse(body->c_str());

		std::string identifier = j["username"]; 
		std::string password = j["password"];

		auto dbResult = m_database->getUserByIdentifier(identifier.c_str());
		auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();


		if (resultSet && resultSet->size() > 0)
		{
			auto user = resultSet[0];

			if (user->password && user->password->c_str() == password)
			{
				
				std::string realName = user->name->c_str();

				using traits = jwt::traits::nlohmann_json;
				auto token = jwt::create<traits>()
					.set_issuer("void_core")
					.set_type("JWS")
					.set_payload_claim("username", traits::value_type(realName)) 
					.sign(jwt::algorithm::hs256{ std::getenv("JWT_SECRET") });

				
				json resp = {
					{"status", "success"},
					{"username", realName},
					 };

				auto response = ResponseFactory::createResponse(Status::CODE_200, resp.dump().c_str());

				int max_age = 60 * 60 * 24 * 7;

				std::string cookie_string = "auth_token=" + token +
					"; HttpOnly; Path=/; Max-Age=" + std::to_string(max_age) +
					"; SameSite=Lax";

				OATPP_LOGI("Set-Cookie", "%s", cookie_string.c_str());

				
				response->putHeader("Set-Cookie", cookie_string.c_str());
				

				auto origin = request->getHeader("Origin");
				if (origin) {
					std::string originStr = origin->c_str();
					if (originStr == "http://localhost" || originStr == "http://localhost") {
						response->putHeader("Access-Control-Allow-Origin", originStr.c_str());
					}
				}



				response->putHeader("Access-Control-Allow-Credentials", "true");

				return response;
			}
		}

		return ResponseFactory::createResponse(Status::CODE_401, "{\"error\":\"Unauthorized\"}");
	}
};