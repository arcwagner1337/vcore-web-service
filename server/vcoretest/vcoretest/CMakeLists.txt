cmake_minimum_required(VERSION 3.10)
project(VoidCoreServer)

set(CMAKE_CXX_STANDARD 17)

find_package(oatpp REQUIRED)
find_package(oatpp-postgresql REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(nlohmann_json REQUIRED)
find_package(jwt-cpp REQUIRED)
find_package(CURL REQUIRED)

add_executable(${PROJECT_NAME} main.cpp "database/dbClient.h" "dtos/userDto.h" "dtos/authDto.h" "handlers/statusHandler.h" "handlers/userHandlers/loginHandlers/loginHandler.h" "handlers/userHandlers/loginHandlers/meHandler.h" "handlers/userHandlers/loginHandlers/logoutHandler.h" "handlers/userHandlers/regHandlers/registerRequestHandler.h" "handlers/userHandlers/regHandlers/registerConfirmHandler.h" "handlers/purchaseHandlers/purchaseHandler.h" "handlers/userHandlers/resetHandlers/updateUserHandler.h" "handlers/userHandlers/resetHandlers/resetPassHandler.h" "handlers/userHandlers/resetHandlers/resetConfirmHandler.h" "handlers/corsHandlers/corsInterceptor.h" "handlers/driverHandlers/driverHandler.h" "handlers/driverHandlers/userModeHandler.h" "handlers/loaderHandlers/loaderLoginHandler.h" "dtos/userHWIDdto.h")

target_include_directories(${PROJECT_NAME} PRIVATE 
    /usr/local/include
)

target_link_libraries(${PROJECT_NAME} 
    oatpp::oatpp
    oatpp::oatpp-postgresql
    OpenSSL::SSL
    OpenSSL::Crypto
    nlohmann_json::nlohmann_json
    jwt-cpp::jwt-cpp
    CURL::libcurl
)