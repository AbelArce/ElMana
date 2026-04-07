# Script para actualizar versión automáticamente en PowerShell
# Uso: .\update-version.ps1 "descripción del cambio"

param(
    [Parameter(Mandatory=$false)]
    [string]$ChangeDescription = "Actualización del sistema"
)

# Obtener fecha actual
$CurrentDate = Get-Date -Format "yyyy-MM-dd"

# Leer y parsear config.json
$configPath = "config.json"
$configContent = Get-Content $configPath -Raw | ConvertFrom-Json

# Obtener versión actual
$CurrentVersion = $configContent.version.numero

# Incrementar versión (patch)
if ($CurrentVersion -match '^(\d+)\.(\d+)\.(\d+)$') {
    $Major = [int]$matches[1]
    $Minor = [int]$matches[2]
    $Patch = [int]$matches[3]
    
    # Incrementar patch
    $Patch = $Patch + 1
    $NewVersion = "$Major.$Minor.$Patch"
} else {
    $NewVersion = "1.0.1"
}

# Actualizar objeto de configuración
$configContent.version.numero = $NewVersion
$configContent.version.fecha = $CurrentDate
$configContent.version.descripcion = $ChangeDescription

# Guardar config.json actualizado
$configContent | ConvertTo-Json -Depth 10 | Set-Content $configPath

Write-Host "Versión actualizada a v$NewVersion ($CurrentDate)" -ForegroundColor Green
Write-Host "Descripción: $ChangeDescription" -ForegroundColor Yellow

# Mostrar cambios
Write-Host "Cambios en config.json:" -ForegroundColor Cyan
git diff config.json
