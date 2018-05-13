FROM microsoft/dotnet:2.0-sdk AS build
COPY . ./app
WORKDIR /app/integration-tests/Enterprise.Commerce.IntegrationTests
RUN dotnet restore -nowarn:msb3202,nu1503