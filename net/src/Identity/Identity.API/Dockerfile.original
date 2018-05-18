FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
COPY src/Identity/Identity.API/Identity.API.csproj src/Identity/Identity.API/
COPY src/Library/WebHostCustomization/WebHost.Customization/WebHost.Customization.csproj src/Library/WebHostCustomization/WebHost.Customization/
COPY src/Library/HealthChecks/Enterprise.Library.HealthChecks/Enterprise.Library.HealthChecks.csproj src/Library/HealthChecks/Enterprise.Library.HealthChecks/
COPY src/Library/HealthChecks/Enterprise.Extensions.HealthChecks/Enterprise.Extensions.HealthChecks.csproj src/Library/HealthChecks/Enterprise.Extensions.HealthChecks/
COPY src/Library/HealthChecks/Enterprise.Extensions.HealthChecks.SqlServer/Enterprise.Extensions.HealthChecks.SqlServer.csproj src/Library/HealthChecks/Enterprise.Extensions.HealthChecks.SqlServer/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/src/Identity/Identity.API
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Identity.API.dll"]
