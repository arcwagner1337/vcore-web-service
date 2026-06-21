#pragma once

#include <fstream>
#include <vector>
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../dtos/userHWIDdto.h"
#include <oatpp/core/data/stream/FileStream.hpp>
#include "oatpp/web/protocol/http/outgoing/StreamingBody.hpp"

class DriverHandler : public oatpp::web::server::HttpRequestHandler {
private:
    std::shared_ptr<MyDbClient> m_database;
public:
    DriverHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

    std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override {
        
        auto authHeader = request->getHeader("Authorization");
        auto deviceIdHeader = request->getHeader("X-Device-ID"); 

        if (!authHeader || !deviceIdHeader) {
            return ResponseFactory::createResponse(Status::CODE_401, "Missing security headers");
        }

        std::string token = authHeader->c_str();
        if (token.find("Bearer ") == 0) token = token.substr(7);
        std::string currentRequestHwid = deviceIdHeader->c_str();

        try {
            
            using traits = jwt::traits::nlohmann_json;
            auto decoded = jwt::decode<traits>(token);
            auto verify = jwt::verify<traits>()
                .allow_algorithm(jwt::algorithm::hs256{ std::getenv("LOADER_JWT_SECRET") })
                .with_issuer("void_core");
            verify.verify(decoded);

            std::string username = decoded.get_payload_claim("username").as_string();
            std::string tokenHwid = decoded.get_payload_claim("hwid").as_string();

            
            auto dbResult = m_database->getUserSubscription(username.c_str());
            auto userSet = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();
            if (!userSet || userSet->size() == 0) return ResponseFactory::createResponse(Status::CODE_404, "User not found");

            auto user = userSet[0];

            
            auto hwidResult = m_database->getUserHwid(user->id);
            auto hwidSet = hwidResult->fetch<oatpp::Vector<oatpp::Object<UserHwidDto>>>();
            if (!hwidSet || hwidSet->size() == 0) return ResponseFactory::createResponse(Status::CODE_403, "No HWID linked");

            std::string dbHwid = hwidSet[0]->hwid->c_str();

            
            if (tokenHwid != currentRequestHwid) return ResponseFactory::createResponse(Status::CODE_403, "Token not for this device");

            
            if (dbHwid != currentRequestHwid) return ResponseFactory::createResponse(Status::CODE_403, "Hardware changed, relogin required");

           
            auto fileHandle = std::make_shared<oatpp::data::stream::FileInputStream>("/app/handlers/driverHandlers/assets/kernelMode.sys");
            if (!fileHandle) return ResponseFactory::createResponse(Status::CODE_404, "File missing");

            auto response = oatpp::web::protocol::http::outgoing::Response::createShared(
                Status::CODE_200,
                std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileHandle)
            );
            
            response->putHeader("Content-Type", "application/octet-stream");
            return response;

        }
        catch (const std::exception& e) {
            OATPP_LOGE("JWT", "Verification failed: %s", e.what());
            return ResponseFactory::createResponse(Status::CODE_403, "Invalid Token");
        }
    }
};
