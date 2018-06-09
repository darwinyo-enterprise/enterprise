cd ./net/tests/Enterprise.Commerce.Tests
dotnet restore
dotnet build 

dotnet test

cd ./Enterprise.Library.EventBus.Tests
dotnet restore
dotnet build 

dotnet test
