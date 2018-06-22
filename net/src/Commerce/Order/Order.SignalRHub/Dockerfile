FROM microsoft/aspnetcore:2.0.8 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0.8-2.1.200 AS build
WORKDIR /src
COPY src/Commerce/Order/Order.SignalRHub/Order.SignalRHub.csproj src/Commerce/Order/Order.SignalRHub/
RUN dotnet restore src/Commerce/Order/Order.SignalRHub/Order.SignalRHub.csproj
COPY . .
WORKDIR /src/src/Commerce/Order/Order.SignalRHub
RUN dotnet build Order.SignalRHub.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish Order.SignalRHub.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Order.SignalRHub.dll"]
