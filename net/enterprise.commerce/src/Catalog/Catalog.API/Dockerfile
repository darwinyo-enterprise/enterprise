FROM localhost:5000/microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM localhost:5000/microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY enterprise.commerce.sln ./
COPY src/Catalog/Catalog.API/Catalog.API.csproj src/Catalog/Catalog.API/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/src/Catalog/Catalog.API
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Catalog.API.dll"]
