FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj integration-tests/Enterprise.Commerce.IntegrationTests/
RUN dotnet restore integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj
COPY . .
WORKDIR /src/integration-tests/Enterprise.Commerce.IntegrationTests