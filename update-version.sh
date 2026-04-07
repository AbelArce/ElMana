#!/bin/bash

# Script para actualizar versión automáticamente
# Uso: ./update-version.sh "descripción del cambio"

# Obtener la descripción del cambio (parámetro o default)
CHANGE_DESCRIPTION="$1"
if [ -z "$CHANGE_DESCRIPTION" ]; then
    CHANGE_DESCRIPTION="Actualización del sistema"
fi

# Obtener fecha actual
CURRENT_DATE=$(date +"%Y-%m-%d")

# Leer versión actual
CURRENT_VERSION=$(grep -o '"numero": "[^"]*"' config.json | cut -d'"' -f4)

# Incrementar versión (patch)
if [[ $CURRENT_VERSION =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    MAJOR=${BASH_REMATCH[1]}
    MINOR=${BASH_REMATCH[2]}
    PATCH=${BASH_REMATCH[3]}
    
    # Incrementar patch
    PATCH=$((PATCH + 1))
    NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
else
    NEW_VERSION="1.0.1"
fi

# Actualizar config.json con nueva versión
sed -i "s/\"numero\": \"[^\"]*\"/\"numero\": \"$NEW_VERSION\"/" config.json
sed -i "s/\"fecha\": \"[^\"]*\"/\"fecha\": \"$CURRENT_DATE\"/" config.json
sed -i "s/\"descripcion\": \"[^\"]*\"/\"descripcion\": \"$CHANGE_DESCRIPTION\"/" config.json

echo "Versión actualizada a v$NEW_VERSION ($CURRENT_DATE)"
echo "Descripción: $CHANGE_DESCRIPTION"

# Mostrar cambios
echo "Cambios en config.json:"
git diff config.json
