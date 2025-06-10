###############################################################################
# 1)  BUILD REACT FRONTEND (stage: frontend-build)
###############################################################################
FROM node:20-alpine AS frontend-build

# Set working dir
WORKDIR /app/ticktoma.client

# Copy React package and lock files
COPY ticktoma.client/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the React app
COPY ticktoma.client ./

# Build React production version
RUN npm run build

###############################################################################
# 2)  BUILD BACKEND .NET (stage: build)
###############################################################################
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copia il .csproj e ripristina i pacchetti
COPY ticktoma.client/ticktoma.client.esproj ./ticktoma.client/
COPY TickToma.Server/TickToma.Server.csproj ./TickToma.Server/
RUN dotnet restore ./TickToma.Server/TickToma.Server.csproj

# copia tutto il backend
COPY TickToma.Server ./TickToma.Server
COPY ticktoma.client ./ticktoma.client

# copia la build React nel wwwroot del backend
COPY --from=frontend-build /app/ticktoma.client/dist ./TickToma.Server/wwwroot

# Installare Node.js (versione LTS) su immagine Debian-based
RUN apt-get update && apt-get install -y curl gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && node --version && npm --version

# pubblica l'app (Release)
RUN dotnet publish ./TickToma.Server/TickToma.Server.csproj \
      -c Release -o /app/publish

###############################################################################
# 3)  RUNTIME IMAGE (stage: runtime)
###############################################################################
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copia la pubblicazione finale
COPY --from=build /app/publish .

# porta d’ascolto; Render la rileverà e farà da reverse‑proxy su HTTPS
ENV ASPNETCORE_URLS=http://*:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TickToma.Server.dll"]