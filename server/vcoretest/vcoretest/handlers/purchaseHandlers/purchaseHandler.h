#pragma once
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../database/dbClient.h"
#include "../../dtos/userDto.h"
#include <nlohmann/json.hpp>
using json = nlohmann::json;

class PurchaseHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;


public:
	PurchaseHandler(const std::shared_ptr<MyDbClient> &database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest> &request) override
	{
		try
		{
			auto body = request->readBodyToString();
			auto j = nlohmann::json::parse(body->c_str());

			const char *env_val = std::getenv("SECRET_INVITE_CODE");
			std::string SECRET_INVITE_CODE = env_val ? std::string(env_val) : "NOT_SET_SECURE_FALLBACK_99123";

		
			if (!j.contains("inviteCode") || j["inviteCode"].get<std::string>() != SECRET_INVITE_CODE)
			{
				auto response = ResponseFactory::createResponse(Status::CODE_403, "{\"error\":\"INVALID_INVITE_CODE\"}");
				response->putHeader("Access-Control-Allow-Origin", "http://localhost");
				response->putHeader("Access-Control-Allow-Credentials", "true");
				return response;
			}

			std::string username = j["username"];
			int days = j.value("customDays", 0);

		
			if (days <= 0 || days > 65)
			{
				return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"Invalid duration\"}");
			}

			int64_t addTime = static_cast<int64_t>(days) * 86400LL;

			auto dbResult = m_database->getUserByName(username);
			auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

			if (resultSet && resultSet->size() > 0)
			{
				auto user = resultSet[0];

				int64_t now = std::chrono::duration_cast<std::chrono::seconds>(
								  std::chrono::system_clock::now().time_since_epoch())
								  .count();

				int64_t currentSubEnd = user->sub_end ? (int64_t)user->sub_end : 0;
				int64_t currentSubStart = user->sub_start ? (int64_t)user->sub_start : 0;

				int64_t newSubEnd = 0;
				int64_t newSubStart = 0;

				if (currentSubEnd > now)
				{
					
					newSubEnd = currentSubEnd + addTime;
					newSubStart = (currentSubStart > 0) ? currentSubStart : now;
				}
				else
				{
					
					newSubStart = now;
					newSubEnd = now + addTime;
				}

				m_database->updateUserSubFull(newSubStart, newSubEnd, username);

				auto response = ResponseFactory::createResponse(Status::CODE_200, "{\"status\":\"success\"}");
				response->putHeader("Access-Control-Allow-Origin", "http://localhost");
				response->putHeader("Access-Control-Allow-Credentials", "true");
				return response;
			}

			return ResponseFactory::createResponse(Status::CODE_404, "{\"error\":\"User not found\"}");
		}
		catch (const std::exception &e)
		{
			OATPP_LOGE("PurchaseHandler", "Error: %s", e.what());
			return ResponseFactory::createResponse(Status::CODE_500, "{\"error\":\"Internal Server Error\"}");
		}
	}
};

