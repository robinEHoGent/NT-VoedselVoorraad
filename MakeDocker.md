to make the docker you need a compose file with the following

- mcr.microsoft.com/azure-storage/azurite:latest 10000-10000
- quintenst/pw2:backend ports 5187-8080
- quintenst/pw2:frontend ports 8888-80

for the backend you will need to set up some environment variables these are

- MYSQL_CONNECTION_STRINGpassword=0021undefined
- AZURITE_BLOB_CONNECTIONSTRING
- Cors\\AllowedOrigins
- Cors\\AllowedMethods
