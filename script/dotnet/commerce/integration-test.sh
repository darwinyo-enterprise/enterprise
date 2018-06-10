docker info
cd ./net
docker-compose -f docker-compose-ci.yml -f docker-compose-ci.override.yml up --abort-on-container-exit

# docker ps

# cd ./integration-tests/Enterprise.Commerce.IntegrationTests
# dotnet restore
# dotnet build 

# dotnet test
