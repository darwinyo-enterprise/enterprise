FROM microsoft/aspnetcore-build:2.0.8-2.1.200 AS build
WORKDIR /src
COPY . .

RUN dotnet restore integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj
RUN dotnet build integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj

WORKDIR integration-tests/Enterprise.Commerce.IntegrationTests
