<#
Script de restauración para backups creados por `backup-db.ps1`.
- Pasos que hace:
  1. Busca el ZIP indicado (o el más reciente en ./backups).
  2. Extrae el .sql dentro de un directorio temporal.
  3. Importa el .sql a la base de datos MySQL indicada usando `mysql`.

Uso:
  # Restaurar desde el ZIP más reciente en .\backups
  .\restore-db.ps1

  # Restaurar desde ZIP específico y con credenciales
  .\restore-db.ps1 -ZipPath .\backups\josnishop_20251118_120000.zip -User root -Password admin -Host localhost -Port 3315 -Database josnishop

Notas de seguridad:
- Evita pasar la contraseña en la línea de comandos en sistemas multiusuario; si no se provee `-Password` el script pedirá la contraseña de forma segura.
- Asegúrate de la compatibilidad de versiones entre el dump y el servidor destino.
#>

param(
    [string]$ZipPath = "",
    [string]$User = "root",
    [string]$Password = $env:MYSQL_PWD,
    [string]$DbHost = "localhost",
    [int]$Port = 3315,
    [string]$Database = "josnishop",
    [switch]$KeepSql
)

# Determinar ZIP por defecto (el más reciente en ./backups)
$backupsDir = Join-Path (Split-Path -Parent $PSCommandPath) "..\backups" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $backupsDir) { $backupsDir = (Join-Path (Split-Path -Parent $PSCommandPath) "..\backups") }
$backupsDir = (Resolve-Path $backupsDir -ErrorAction SilentlyContinue) -as [string]
if (-not $backupsDir) { $backupsDir = Join-Path (Split-Path -Parent $PSCommandPath) "..\backups" }

if ([string]::IsNullOrWhiteSpace($ZipPath)) {
    if (Test-Path $backupsDir) {
        $zips = Get-ChildItem -Path $backupsDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending
        if ($zips.Count -eq 0) { Write-Error "No se encontraron archivos .zip en $backupsDir"; Exit 1 }
        $ZipPath = $zips[0].FullName
    } else {
        Write-Error "No existe la carpeta de backups: $backupsDir"; Exit 1
    }
}

Write-Host "Usando ZIP: $ZipPath"

# Pedir password si no provista
if (-not $Password -or $Password -eq "") {
    Write-Host "Introduce la contraseña de MySQL (oculta):"
    $secure = Read-Host -AsSecureString
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

# Localizar mysql
$mysql = $env:MYSQL_PATH
if (-not $mysql -or $mysql -eq "") { $mysql = "mysql" }

# Crear carpeta temporal
$tmp = Join-Path $env:TEMP ("restore_" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tmp | Out-Null

try {
    Write-Host "Extrayendo ZIP a: $tmp"
    Expand-Archive -Path $ZipPath -DestinationPath $tmp -Force

    # buscar archivo .sql en el directorio extraído
    $sqlFiles = Get-ChildItem -Path $tmp -Filter "*.sql" -Recurse
    if ($sqlFiles.Count -eq 0) { Write-Error "No se encontró archivo .sql dentro del ZIP"; Exit 2 }
    if ($sqlFiles.Count -gt 1) { Write-Warning "Se encontraron varios .sql, se usará el primero: $($sqlFiles[0].FullName)" }

    $sqlPath = $sqlFiles[0].FullName
    Write-Host "Importando SQL: $sqlPath -> $DbHost:$Port / $Database"

    # Construir comando mysql. Evitamos exponer la contraseña en el history pasando MYSQL_PWD a entorno temporal.
    $env:MYSQL_PWD = $Password
    $args = "-u $User -h $DbHost -P $Port $Database"

    # Ejecutar import
    & $mysql $args < $sqlPath
    $exit = $LASTEXITCODE
    if ($exit -ne 0) { Write-Error "Import falló con código $exit"; Exit $exit }

    Write-Host "Restauración completada correctamente." -ForegroundColor Green
} catch {
    Write-Error "Error durante la restauración: $_"
    Exit 1
} finally {
    if (-not $KeepSql) {
        # limpiar temporal
        Remove-Item -Path $tmp -Recurse -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "Se preservó el contenido extraído en: $tmp"
    }
    # limpiar variable temporal
    Remove-Variable -Name MYSQL_PWD -ErrorAction SilentlyContinue
}
