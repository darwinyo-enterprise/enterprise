FROM microsoft/dotnet:2.0-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.0-sdk AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
COPY integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj integration-tests/Enterprise.Commerce.IntegrationTests/
COPY src/Commerce/Catalog/Catalog.API/Catalog.API.csproj src/Commerce/Catalog/Catalog.API/
COPY src/Library/EventBus/Enterprise.Library.IntegrationEventLog/Enterprise.Library.IntegrationEventLog.csproj src/Library/EventBus/Enterprise.Library.IntegrationEventLog/
COPY src/Library/EventBus/Enterprise.Library.EventBus/Enterprise.Library.EventBus.csproj src/Library/EventBus/Enterprise.Library.EventBus/
COPY src/Library/FileUtility/Enterprise.Library.FileUtility/Enterprise.Library.FileUtility.csproj src/Library/FileUtility/Enterprise.Library.FileUtility/
COPY src/Library/HealthChecks/Enterprise.Library.HealthChecks/Enterprise.Library.HealthChecks.csproj src/Library/HealthChecks/Enterprise.Library.HealthChecks/
COPY src/Library/HealthChecks/Enterprise.Extensions.HealthChecks/Enterprise.Extensions.HealthChecks.csproj src/Library/HealthChecks/Enterprise.Extensions.HealthChecks/
COPY src/Library/EventBus/Enterprise.Library.EventBus.RabbitMQ/Enterprise.Library.EventBus.RabbitMQ.csproj src/Library/EventBus/Enterprise.Library.EventBus.RabbitMQ/
COPY src/Library/HealthChecks/Enterprise.Extensions.HealthChecks.SqlServer/Enterprise.Extensions.HealthChecks.SqlServer.csproj src/Library/HealthChecks/Enterprise.Extensions.HealthChecks.SqlServer/
COPY src/Library/HealthChecks/Enterprise.Extensions.HealthChecks.AzureStorage/Enterprise.Extensions.HealthChecks.AzureStorage.csproj src/Library/HealthChecks/Enterprise.Extensions.HealthChecks.AzureStorage/
COPY src/Library/WebHostCustomization/WebHost.Customization/WebHost.Customization.csproj src/Library/WebHostCustomization/WebHost.Customization/
COPY src/Library/EventBus/Enterprise.Library.EventBus.ServiceBus/Enterprise.Library.EventBus.ServiceBus.csproj src/Library/EventBus/Enterprise.Library.EventBus.ServiceBus/
COPY src/Commerce/Basket/Basket.API/Basket.API.csproj src/Commerce/Basket/Basket.API/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/integration-tests/Enterprise.Commerce.IntegrationTests
RUN dotnet build -c Release -o /app

FROM build AS test
RUN dotnet test Enterprise.Commerce.IntegrationTests.csproj