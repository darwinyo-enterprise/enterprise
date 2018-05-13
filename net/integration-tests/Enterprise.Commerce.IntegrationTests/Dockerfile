FROM microsoft/dotnet:2.0-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.0-sdk AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
COPY integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj integration-tests/Enterprise.Commerce.IntegrationTests/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/integration-tests/Enterprise.Commerce.IntegrationTests
RUN dotnet build

FROM build AS test
RUN dotnet test Enterprise.Commerce.IntegrationTests.csproj