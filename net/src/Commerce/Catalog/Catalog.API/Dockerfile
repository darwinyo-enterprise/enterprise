FROM microsoft/aspnetcore:2.0.8 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0.8-2.1.200 AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
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
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/src/Commerce/Catalog/Catalog.API
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Catalog.API.dll"]
