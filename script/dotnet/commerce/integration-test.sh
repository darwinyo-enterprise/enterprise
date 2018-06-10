cd ./net
docker-compose -f docker-compose-external.yml -f docker-compose-ci-external.override.yml up --abort-on-container-exit

docker ps

cd ./integration-tests/Enterprise.Commerce.IntegrationTests
dotnet restore
dotnet build 

dotnet test
