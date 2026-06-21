#pragma once
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../../database/dbClient.h"
#include "../../../dtos/userDto.h"
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"
#include <nlohmann/json.hpp>
using json = nlohmann::json;

class UpdateUserHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;

public:
	UpdateUserHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{
		try
		{
			auto body = request->readBodyToString();
			auto j = nlohmann::json::parse(body->c_str());
			std::string currentUsername = j["current_username"];

			auto dbResult = m_database->getUserByName(currentUsername);
			auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

			if (resultSet && resultSet->size() > 0)
			{
				auto user = resultSet[0];

				
				std::string jName = j.value("display_name", "");
				std::string jEmail = j.value("email", "");
				std::string jPass = j.value("password", "");

				std::string finalName = jName.empty() ? std::string(user->name->c_str()) : jName;

			
				std::string finalEmail = jEmail.empty() ? (user->email ? std::string(user->email->c_str()) : "") : jEmail;

				std::string finalPass = jPass.empty() ? std::string(user->password->c_str()) : jPass;

				m_database->updateUserProfile(
					finalName.c_str(),
					finalEmail.c_str(),
					finalPass.c_str(),
					currentUsername.c_str());

				using traits = jwt::traits::nlohmann_json;
				auto token = jwt::create<traits>()
					.set_issuer("void_core")
					.set_type("JWS")
					.set_payload_claim("username", traits::value_type(finalName)) 
					.sign(jwt::algorithm::hs256{ std::getenv("JWT_SECRET") });

				auto response = ResponseFactory::createResponse(Status::CODE_200, "{\"status\":\"success\"}");

			
				int max_age = 60 * 60 * 24 * 7;
				std::string cookie_string = "auth_token=" + token +
					"; HttpOnly; Path=/; Max-Age=" + std::to_string(max_age) +
					"; SameSite=Lax";

				response->putHeader("Set-Cookie", cookie_string.c_str());
				response->putHeader("Access-Control-Allow-Origin", "http://localhost");
				response->putHeader("Access-Control-Allow-Credentials", "true");

				return response;
			}

			return ResponseFactory::createResponse(Status::CODE_404, "{\"error\":\"User not found\"}");
		}
		catch (const std::exception& e)
		{
			return ResponseFactory::createResponse(Status::CODE_500, "{\"error\":\"Server Error\"}");
		}
	}
};