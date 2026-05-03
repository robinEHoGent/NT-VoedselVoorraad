# ----------------------------
# 1. Build stage
# ----------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /App

# Copy csproj files
COPY "Nimble-It.sln" ./
COPY Nimble-It.Api/Nimble-It.csproj Nimble-It.Api/
COPY Nimble-It.Api.Contracts/Nimble-It.Api.Contracts.csproj Nimble-It.Api.Contracts/
COPY Nimble-It.Domain.Models/Nimble-It.Domain.Models.csproj Nimble-It.Domain.Models/
COPY Nimble-It.Domain.Services/Nimble-It.Domain.Services.csproj Nimble-It.Domain.Services/
COPY Nimble-It.Persistence.Entities/Nimble-It.Persistence.Entities.csproj Nimble-It.Persistence.Entities/
COPY Nimble-It.Persistence/Nimble-It.Persistence.csproj Nimble-It.Persistence/
COPY Nimble-It.UnitTests/Nimble-It.UnitTests.csproj Nimble-It.UnitTests/

# Restore **alle dependencies van de oplossing**
RUN dotnet restore "Nimble-It.sln"

COPY . ./

run dotnet clean "Nimble-It.sln"

# Publish
RUN dotnet publish "Nimble-It.Api/Nimble-It.csproj" -c Release -o /App/publish 

FROM mcr.microsoft.com/dotnet/aspnet:9.0 

WORKDIR /App
COPY --from=build /App/publish  .
ENTRYPOINT ["dotnet", "Nimble-It.dll"]
