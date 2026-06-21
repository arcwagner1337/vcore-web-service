#pragma once
#include <random>
#include "oatpp/web/server/HttpRouter.hpp"
#include "../../../database/dbClient.h"
#include "../../../dtos/userDto.h"
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"
#include <curl/curl.h>



class RegisterRequestHandler : public oatpp::web::server::HttpRequestHandler
{
private:
	std::shared_ptr<MyDbClient> m_database;

	static size_t payload_source(void* ptr, size_t size, size_t nmemb, void* userp)
	{
		std::string* upload = (std::string*)userp;
		if (size * nmemb < 1 || upload->empty())
			return 0;
		size_t len = (std::min)(size * nmemb, upload->length());
		memcpy(ptr, upload->c_str(), len);
		upload->erase(0, len);
		return len;
	}

public:
	RegisterRequestHandler(const std::shared_ptr<MyDbClient>& database) : m_database(database) {}

	std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override
	{
		auto body = request->readBodyToString();
		auto j = nlohmann::json::parse(body->c_str());

		if (!j.contains("username") || !j.contains("email") || !j.contains("password"))
			return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"Missing fields\"}");

		std::string username = j["username"];
		std::string email = j["email"];
		std::string password = j["password"];


		auto userCheck = m_database->getUserByIdentifier(username.c_str());
		auto userSet = userCheck->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();
		if (userSet && userSet->size() > 0)
			return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"USER_ALREADY_EXISTS\"}");


		std::random_device rd;
		std::mt19937 gen(rd());
		std::uniform_int_distribution<> dis(100000, 999999);
		std::string code = std::to_string(dis(gen));

		m_database->clearPendingRegistration(username.c_str(), email.c_str());
		m_database->insertPendingRegistration(username.c_str(), email.c_str(), password.c_str(), code.c_str());



		CURL* curl = curl_easy_init();
		if (curl)
		{
			std::string from = std::getenv("SENDER_ADDR");

			std::string password = std::getenv("SENDER_PASS");



			std::string payload_text =
				"To: " + email + "\r\n" +
				"From: " + from + "\r\n" +
				"Subject: email verify Code - VoidCore\r\n" +
				"Content-Type: text/plain; charset=UTF-8\r\n" +
				"\r\n" +
				"Your verification code: " + code + "\r\n";

			curl_easy_setopt(curl, CURLOPT_URL, std::getenv("SENDER_PORT"));
			curl_easy_setopt(curl, CURLOPT_USERNAME, from.c_str()); 
			curl_easy_setopt(curl, CURLOPT_PASSWORD, password.c_str());

			curl_easy_setopt(curl, CURLOPT_USE_SSL, (long)CURLUSESSL_NONE);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 1L);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 2L);

			curl_easy_setopt(curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
			curl_easy_setopt(curl, CURLOPT_LOGIN_OPTIONS, "AUTH=LOGIN");

			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 10L);
			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 20L);

			curl_easy_setopt(curl, CURLOPT_MAIL_FROM, from.c_str());

			struct curl_slist* recipients = NULL;
			recipients = curl_slist_append(recipients, email.c_str());
			curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);

			curl_easy_setopt(curl, CURLOPT_READFUNCTION, payload_source);
			curl_easy_setopt(curl, CURLOPT_READDATA, &payload_text);
			curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);
			curl_easy_setopt(curl, CURLOPT_FORBID_REUSE, 1L);

			curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

			CURLcode res = curl_easy_perform(curl);

			curl_slist_free_all(recipients);
			curl_easy_cleanup(curl);

			if (res != CURLE_OK)
			{
				OATPP_LOGE("SMTP", "Yandex mircropenis failed: %s", curl_easy_strerror(res));
				return ResponseFactory::createResponse(Status::CODE_400, "{\"error\":\"someError\"}");
			}

			OATPP_LOGI("SMTP", "Email sent successfully mircropenis to %s", email.c_str());
		}

		return ResponseFactory::createResponse(Status::CODE_200, "{\"status\":\"code_sent\"}");
	}
};