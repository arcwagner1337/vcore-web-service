#pragma once
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../../database/dbClient.h"
#include "../../../dtos/userDto.h"
#include <nlohmann/json.hpp>
using json = nlohmann::json;



class ResetConfirmHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;

public:
	ResetConfirmHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{
		auto body = request->readBodyToString();
		auto j = nlohmann::json::parse(body->c_str());

		std::string email = j["email"];
		std::string code = j["code"];
		std::string newPassword = j["password"];


		auto dbResult = m_database->getResetCode(email.c_str(), code.c_str());
		auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Vector<oatpp::Int64>>>();

	
		if (resultSet && resultSet->size() > 0 && resultSet[0]->size() > 0 && resultSet[0][0] > 0)
		{
		
			auto userResult = m_database->getUserByIdentifier(email.c_str());
			auto userSet = userResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

			if (userSet && userSet->size() > 0)
			{
				auto user = userSet[0];

	
				m_database->updateUserProfile(
					user->name,
					user->email,
					newPassword.c_str(),
					user->name);

			
				m_database->deleteResetCode(email.c_str());

				return ResponseFactory::createResponse(Status::CODE_200, "{\"status\":\"success\"}");
			}
		}

		return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"Invalid or expired code\"}");
	}
};