#pragma once
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../../database/dbClient.h"
#include "../../../dtos/userDto.h"
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"


class RegisterConfirmHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;

public:
	RegisterConfirmHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{

		OATPP_LOGI("CONFIRM", "--- START HANDLER ---");
		auto body = request->readBodyToString();

		if (!body)
		{
			OATPP_LOGE("CONFIRM", "Empty body!");
			return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"no_body\"}");
		}
		OATPP_LOGI("CONFIRM", "Body received: %s", body->c_str());
		try
		{
			auto j = nlohmann::json::parse(body->c_str());


			oatpp::String username = j["username"].get<std::string>().c_str();
			oatpp::String code = j["code"].get<std::string>().c_str();

	

			OATPP_LOGI("CONFIRM", "Parsed: user='%s', code='%s'", username, code);

			auto dbResult = m_database->getPendingRegistration(username, code);
			auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<PendingUser>>>();

			OATPP_LOGI("CONFIRM", "DB Rows: %d", resultSet ? (int)resultSet->size() : -1);

			if (resultSet && resultSet->size() > 0)
			{

				auto row = resultSet[0]; 

				if (!row->email || !row->password)
				{
					return ResponseFactory::createResponse(Status::CODE_500, "{\"error\":\"DB_DATA_CORRUPT\"}");
				}

			
				oatpp::String emailObj = row->email;
				oatpp::String passObj = row->password;
				oatpp::String nameObj = username;

			
				m_database->createUser(nameObj, passObj, emailObj, int64_t(0), int64_t(0));

				using traits = jwt::traits::nlohmann_json;
				auto token = jwt::create<traits>()
					.set_issuer("void_core")
					.set_type("JWS")
					.set_payload_claim("username", traits::value_type(nameObj->c_str()))
					.sign(jwt::algorithm::hs256{ std::getenv("JWT_SECRET") });

		
				auto response = ResponseFactory::createResponse(Status::CODE_200,
					"{\"status\":\"registration_complete\",\"username\":\"" + std::string(nameObj->c_str()) + "\"}");

		
				int max_age = 60 * 60 * 24 * 7;
				std::string cookie_string = "auth_token=" + token +
					"; HttpOnly; Path=/; Max-Age=" + std::to_string(max_age) +
					"; SameSite=Lax";
				response->putHeader("Set-Cookie", cookie_string.c_str());

	
				m_database->deletePendingRegistration(username, code);
				OATPP_LOGI("CONFIRM", "SUCCESS!");
				return response;
			
			}
		}
		catch (const std::exception& e)
		{
			OATPP_LOGE("CONFIRM", "JSON Error: %s", e.what());
		}

		return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"Invalid or expired code\"}");
	}
};