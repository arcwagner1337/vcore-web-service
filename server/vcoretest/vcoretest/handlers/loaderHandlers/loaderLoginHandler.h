#pragma once


#include "../../database/dbClient.h"
#include "../../dtos/userDto.h"
#include "../../dtos/userHWIDdto.h"
#include "oatpp/web/server/HttpRouter.hpp"
#include <nlohmann/json.hpp>
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"

using json = nlohmann::json;

class LoaderLoginHandler : public oatpp::web::server::HttpRequestHandler {
private:
	std::shared_ptr<MyDbClient> m_database;
public:
	LoaderLoginHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

    std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override {
        try {

            if (request->getStartingLine().method == "OPTIONS") {
                auto response = ResponseFactory::createResponse(Status::CODE_204, "");
                response->putHeader("Access-Control-Allow-Origin", "http://localhost:3000");
                response->putHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                response->putHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Device-ID");
                return response;
            }

            auto body = request->readBodyToString();
            auto j = nlohmann::json::parse(body->c_str());

           
            if (!j.contains("username") || !j.contains("password") || !j.contains("hwid")) {
                return ResponseFactory::createResponse(Status::CODE_400, "Bad Request: Missing fields");
            }

            std::string identifier = j["username"];
            std::string password = j["password"];
            std::string hwid = j["hwid"];

            auto dbResult = m_database->getUserByIdentifier(identifier.c_str());
            auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

            if (resultSet && resultSet->size() > 0) {
                auto user = resultSet[0];

                
                if (user->password && user->password->c_str() == password) {

                    auto now = std::chrono::duration_cast<std::chrono::seconds>(
                        std::chrono::system_clock::now().time_since_epoch()
                    ).count();

                    auto now_time = std::chrono::system_clock::now();

                   
                    auto expire = now_time + std::chrono::hours(24);


                    if (!user->sub_end || user->sub_end < (v_int64)now) {
                        return ResponseFactory::createResponse(Status::CODE_403, "{\"error\":\"Subscription expired\"}");
                    }

                  
                    auto hwidResult = m_database->getUserHwid(user->id);
                    auto hwidSet = hwidResult->fetch<oatpp::Vector<oatpp::Object<UserHwidDto>>>();

                    if (hwidSet && hwidSet->size() > 0) {
                        if (std::string(hwidSet[0]->hwid->c_str()) != hwid) {
                            return ResponseFactory::createResponse(Status::CODE_403, "{\"error\":\"HWID mismatch!\"}");
                        }
                    }
                    else {
                      
                        m_database->setUserHwid(user->id, hwid.c_str(), now);
                    }

                   
                    using traits = jwt::traits::nlohmann_json;
                    auto token = jwt::create<traits>()
                        .set_issuer("void_core")
                        .set_expires_at(expire)
                        .set_payload_claim("username", traits::value_type(user->name->c_str()))
                        .set_payload_claim("hwid", traits::value_type(hwid)) 
                        .sign(jwt::algorithm::hs256{ std::getenv("LOADER_JWT_SECRET") });

                    json resp = { {"status", "success"}, {"token", token} };

                    auto response = ResponseFactory::createResponse(Status::CODE_200, resp.dump().c_str());
                    response->putHeader("Access-Control-Allow-Origin", "http://localhost:3000");
                    response->putHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                    response->putHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Device-ID");
                    response->putHeader("Content-Type", "application/json");

                    return response;
                }
            }
            return ResponseFactory::createResponse(Status::CODE_401, "Invalid credentials");

        }
        catch (const std::exception& e) {
            return ResponseFactory::createResponse(Status::CODE_400, "Invalid JSON or Internal Error");
        }
    }
};