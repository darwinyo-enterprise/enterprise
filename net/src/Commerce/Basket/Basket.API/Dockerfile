FROM microsoft/aspnetcore:2.0.8 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0.8-2.1.200 AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
COPY src/Commerce/Basket/Basket.API/Basket.API.csproj src/Commerce/Basket/Basket.API/
COPY src/Library/HealthChecks/Enterprise.Library.HealthChecks/Enterprise.Library.HealthChecks.csproj src/Library/HealthChecks/Enterprise.Library.HealthChecks/
COPY src/Library/HealthChecks/Enterprise.Extensions.HealthChecks/Enterprise.Extensions.HealthChecks.csproj src/Library/HealthChecks/Enterprise.Extensions.HealthChecks/
COPY src/Library/EventBus/Enterprise.Library.EventBus.RabbitMQ/Enterprise.Library.EventBus.RabbitMQ.csproj src/Library/EventBus/Enterprise.Library.EventBus.RabbitMQ/
COPY src/Library/EventBus/Enterprise.Library.EventBus/Enterprise.Library.EventBus.csproj src/Library/EventBus/Enterprise.Library.EventBus/
COPY src/Library/EventBus/Enterprise.Library.EventBus.ServiceBus/Enterprise.Library.EventBus.ServiceBus.csproj src/Library/EventBus/Enterprise.Library.EventBus.ServiceBus/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/src/Commerce/Basket/Basket.API
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Basket.API.dll"]
