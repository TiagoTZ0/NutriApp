#!/bin/bash

# Si algún comando falla, el script se detiene (seguridad)
set -o errexit
set -o pipefail
set -o nounset

# Verificamos que Postgres esté listo antes de arrancar (si están definidas las variables)
if [ -n "${SQL_HOST:-}" ] && [ -n "${SQL_PORT:-}" ]
then
    echo "Esperando a PostgreSQL..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL iniciado correctamente"
fi

# Ejecutamos el comando que nos pase Docker (runserver o gunicorn)
exec "$@"