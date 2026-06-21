#pragma once
#include "../../../database/dbClient.h"
#include "../../../dtos/userDto.h"
#include "oatpp/web/server/HttpRouter.hpp"
#include <nlohmann/json.hpp>
using json = nlohmann::json;
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"



class MeHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;

public:
	MeHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{
        auto cookies = request->getHeader("Cookie");
        if (!cookies || cookies->empty()) {
            return ResponseFactory::createResponse(Status::CODE_401, "{\"error\":\"Session expired\"}");
        }

        std::string cookieStr = cookies->c_str();
        std::string tokenPrefix = "auth_token=";
        size_t pos = cookieStr.find(tokenPrefix);
        if (pos == std::string::npos) return ResponseFactory::createResponse(Status::CODE_401, "{\"error\":\"Token not found\"}");

        size_t start = pos + tokenPrefix.length();
        size_t end = cookieStr.find(";", start);
        std::string token = cookieStr.substr(start, end - start);

        try {
            using traits = jwt::traits::nlohmann_json;
            auto decoded = jwt::decode<traits>(token);
            auto verifier = jwt::verify<traits>()
                .allow_algorithm(jwt::algorithm::hs256{ std::getenv("JWT_SECRET") })
                .with_issuer("void_core");
            verifier.verify(decoded);

            std::string username = decoded.get_payload_claim("username").as_string();

         
            auto dbResult = m_database->getUserByName(username.c_str());
            auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

            if (!resultSet || resultSet->size() == 0) {
                return ResponseFactory::createResponse(Status::CODE_401, "{\"error\":\"Account no longer exists\"}");
            }

            auto user = resultSet[0];
            auto now = std::chrono::duration_cast<std::chrono::seconds>(
                std::chrono::system_clock::now().time_since_epoch()
            ).count();

       
            bool isSubActive = (user->sub_end && user->sub_end > (v_int64)std::time(nullptr));

            nlohmann::json resp = {
                {"status", "success"},
                {"username", username},
                {"email", user->email ? user->email->c_str() : ""},
                {"sub_active", isSubActive}, 
                {"sub_end", user->sub_end ? (int64_t)user->sub_end : 0}
            };

            auto response = ResponseFactory::createResponse(Status::CODE_200, resp.dump().c_str());

		
			response->putHeader("Access-Control-Allow-Origin", "http://localhost");
			response->putHeader("Access-Control-Allow-Credentials", "true");

			return response;
		}
		catch (const std::exception& e)
		{
			return ResponseFactory::createResponse(Status::CODE_401, "{\"error\":\"Invalid token\"}");
		}
	}
};