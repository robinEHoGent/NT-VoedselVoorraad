FROM mysql:8.0

# Default credentials — override via docker-compose or env-file in production
ENV MYSQL_ROOT_PASSWORD=root \
    MYSQL_DATABASE=nimbleit_db \
    MYSQL_USER=nimbleit_user \
    MYSQL_PASSWORD=N1mbleIt5!

# Copy initialization scripts; files placed in /docker-entrypoint-initdb.d are executed
# in alphabetical order when the container initializes a fresh database
COPY db/init/initdb.sql /docker-entrypoint-initdb.d/01-initdb.sql
COPY nimbleItInventorySetup.sql /docker-entrypoint-initdb.d/02-nimbleItInventorySetup.sql

EXPOSE 3306
VOLUME /var/lib/mysql
