#define JWT_DISABLE_PICOJSON /
#include <iostream>
#include <algorithm>
#include <random>


#include "oatpp/network/tcp/server/ConnectionProvider.hpp"
#include "oatpp/web/server/HttpRouter.hpp"
#include "oatpp/web/server/HttpConnectionHandler.hpp"
#include "oatpp/network/Server.hpp"
#include "oatpp-postgresql/orm.hpp"
#include "oatpp/core/macro/codegen.hpp"

#include "oatpp/core/data/mapping/type/Object.hpp"
#include <nlohmann/json.hpp>
using json = nlohmann::json;
#include "jwt-cpp/jwt.h"
#include "jwt-cpp/traits/nlohmann-json/traits.h"
#include <curl/curl.h>


#include "database/dbClient.h"
#include "dtos/authDto.h"
#include "dtos/userDto.h"
#include "handlers/statusHandler.h"
#include "handlers/userHandlers/loginHandlers/loginHandler.h"
#include "handlers/userHandlers/loginHandlers/meHandler.h"
#include "handlers/userHandlers/loginHandlers/logoutHandler.h"
#include "handlers/userHandlers/regHandlers/registerRequestHandler.h"
#include "handlers/userHandlers/regHandlers/registerConfirmHandler.h"
#include "handlers/purchaseHandlers/purchaseHandler.h"
#include "handlers/userHandlers/resetHandlers/updateUserHandler.h"
#include "handlers/userHandlers/resetHandlers/resetPassHandler.h"
#include "handlers/userHandlers/resetHandlers/resetConfirmHandler.h"
#include "handlers/corsHandlers/corsInterceptor.h"
#include "handlers/driverHandlers/driverHandler.h"
#include "handlers/driverHandlers/userModeHandler.h"
#include "handlers/loaderHandlers/loaderLoginHandler.h"


int main()
{
	
	oatpp::base::Environment::init();
	

	std::cout << "--- Starting Void Core Server ---" << std::endl;

	
	auto dbConnectionProvider = std::make_shared<oatpp::postgresql::ConnectionProvider>(
		"postgresql://dev:vcore_password@vcore_db:5432/void_core");

	auto executor = std::make_shared<oatpp::postgresql::Executor>(dbConnectionProvider);
	auto dbClient = std::make_shared<MyDbClient>(executor);

	std::cout << "Database client initialized." << std::endl;

	
	auto router = oatpp::web::server::HttpRouter::createShared();
	
	router->route("GET", "/status", std::make_shared<StatusHandler>());
	
	router->route("POST", "/users/login", std::make_shared<LoginHandler>(dbClient));
	
	router->route("POST", "/users/logout", std::make_shared<LogoutHandler>());
	router->route("GET", "/users/me", std::make_shared<MeHandler>(dbClient));
	router->route("POST", "/purchase", std::make_shared<PurchaseHandler>(dbClient));
	router->route("POST", "/users/update", std::make_shared<UpdateUserHandler>(dbClient));
	router->route("POST", "/users/reset-request", std::make_shared<ResetPasswordHandler>(dbClient));
	router->route("POST", "/users/reset-confirm", std::make_shared<ResetConfirmHandler>(dbClient));
	router->route("POST", "/users/register-request", std::make_shared<RegisterRequestHandler>(dbClient));
	router->route("POST", "/users/register-confirm", std::make_shared<RegisterConfirmHandler>(dbClient));
	router->route("GET", "/download/driver", std::make_shared<DriverHandler>(dbClient));
	router->route("GET", "/download/usermode", std::make_shared<UserModeHandler>(dbClient));
	router->route("POST", "/loader/login", std::make_shared<LoaderLoginHandler>(dbClient));


	auto user = UserDto::createShared();

	
	auto serverConnectionProvider = oatpp::network::tcp::server::ConnectionProvider::createShared({"0.0.0.0", 8000, oatpp::network::Address::IP_4});

	
	auto connectionHandler = oatpp::web::server::HttpConnectionHandler::createShared(router);
	connectionHandler->addRequestInterceptor(std::make_shared<CorsInterceptor>());
	
	oatpp::network::Server server(serverConnectionProvider, connectionHandler);

	std::cout << "Server is listening on port 8000..." << std::endl;
	std::cout << "Check it here: http://localhost:8000" << std::endl;

	server.run();

	oatpp::base::Environment::destroy();
	return 0;
}