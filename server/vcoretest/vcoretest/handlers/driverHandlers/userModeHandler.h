#pragma once
#include <fstream>
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../database/dbClient.h"
#include "../../dtos/userDto.h"

class UserModeHandler : public oatpp::web::server::HttpRequestHandler {
private:
    std::shared_ptr<MyDbClient> m_database;
public:
    UserModeHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}
    std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override {

        if (request->getStartingLine().method == "OPTIONS") {
            auto response = ResponseFactory::createResponse(Status::CODE_204, "");
            response->putHeader("Access-Control-Allow-Origin", "http://localhost:3000"); 
            response->putHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response->putHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Device-ID");
            return response;
        }



        auto authHeader = request->getHeader("Authorization");
        auto deviceIdHeader = request->getHeader("X-Device-ID");

        if (!authHeader || !deviceIdHeader) {
            return ResponseFactory::createResponse(Status::CODE_401, "Security headers missing");
        }

        std::string token = authHeader->c_str();
        if (token.find("Bearer ") == 0) token = token.substr(7);
        std::string currentDeviceHwid = deviceIdHeader->c_str();


        try {
            using traits = jwt::traits::nlohmann_json;
            auto verify = jwt::verify<traits>()
                .allow_algorithm(jwt::algorithm::hs256{ std::getenv("LOADER_JWT_SECRET") }) 
                .with_issuer("void_core");

            auto decoded = jwt::decode<traits>(token);
            verify.verify(decoded);

            
            std::string username = decoded.get_payload_claim("username").as_string();
            std::string tokenHwid = decoded.get_payload_claim("hwid").as_string();

            auto dbResult = m_database->getUserSubscription(username.c_str());
            auto resultSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

            if (resultSet && resultSet->size() > 0) {
                auto sub_end = resultSet[0]->sub_end;
                auto now = std::chrono::duration_cast<std::chrono::seconds>(
                    std::chrono::system_clock::now().time_since_epoch()
                ).count();

                if (!sub_end || sub_end < (v_int64)now) {
                    return ResponseFactory::createResponse(Status::CODE_403, "{\"error\":\"Subscription expired\"}");
                }
            }
            else {
                return ResponseFactory::createResponse(Status::CODE_404, "{\"error\":\"User not found\"}");
            }


            if (tokenHwid != currentDeviceHwid) {
                OATPP_LOGE("SECURITY", "HWID mismatch! Token: %s, Request: %s", tokenHwid.c_str(), currentDeviceHwid.c_str());
                return ResponseFactory::createResponse(Status::CODE_403, "Hardware mismatch");
            }

        }
        catch (const std::exception& e) {
            return ResponseFactory::createResponse(Status::CODE_403, "Invalid or expired token");
        }




  
        const std::string exePath = "/app/handlers/driverHandlers/assets/userMode.exe";

        std::ifstream file(exePath, std::ios::binary | std::ios::ate);
        if (!file.is_open()) {
            return ResponseFactory::createResponse(Status::CODE_404, "UserMode EXE not found");
        }

        std::streamsize size = file.tellg();
        file.seekg(0, std::ios::beg);

        auto fileContent = oatpp::String((int)size);
        file.read((char*)fileContent->data(), size);

        auto response = ResponseFactory::createResponse(Status::CODE_200, fileContent);
        response->putHeader("Content-Type", "application/octet-stream");
        auto origin = request->getHeader("Origin");
        if (origin) {
            std::string o = origin->c_str();
           
            if (o == "http://localhost:3000" || o == "http://localhost") {
                response->putHeader("Access-Control-Allow-Origin", o.c_str());
            }
        }
        return response;
    }
};