FROM microsoft/dotnet:2.0-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.0-sdk AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
COPY integration-tests/Enterprise.Commerce.IntegrationTests/Enterprise.Commerce.IntegrationTests.csproj integration-tests/Enterprise.Commerce.IntegrationTests/
COPY src/Commerce/Catalog/Catalog.API/Catalog.API.csproj src/Commerce/Catalog/Catalog.API/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/Commerce/Catalog/Catalog.API
RUN dotnet build -c Release -o /app

FROM build AS test
WORKDIR /src/integration-tests/Enterprise.Commerce.IntegrationTests
RUN dotnet test

FROM build AS publish
WORKDIR /src/Commerce/Catalog/Catalog.API
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Catalog.API.dll"]
