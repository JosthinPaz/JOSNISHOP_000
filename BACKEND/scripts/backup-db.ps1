<#
PowerShell script para hacer backup de la base de datos MySQL usada por este proyecto.
- Detecta credenciales en la variable de entorno MYSQL_PWD o te pedirá la contraseña.
- Usa `mysqldump` (debe estar instalado y accesible en PATH o especificar `MYSQLDUMP_PATH` env var).
- Genera un .sql con timestamp y lo comprime a .zip.

Uso:
  PS> .\backup-db.ps1                     # usa valores por defecto (root/admin, puerto 3315, db josnishop)
  PS> .\backup-db.ps1 -User myuser -Password "mypass" -OutDir C:\backups

Recomendaciones:
- No guardes contraseñas en scripts en texto plano; usa variables de entorno o un archivo .my.cnf seguro.
- Para automatizar en Windows, crea una tarea programada que ejecute este script.
#>

param(
    [string]$User = "root",
    [string]$Password = $env:MYSQL_PWD,
    [string]$DbHost = "localhost",
    [int]$Port = 3315,
    [string]$Database = "josnishop",
    [string]$OutDir = ".\backups"
)

# Asegurar carpeta de salida
if (-not (Test-Path -Path $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$filename = "${Database}_${timestamp}.sql"
$outPath = Join-Path $OutDir $filename

# Pedir password si no viene por env
if (-not $Password -or $Password -eq "") {
    Write-Host "No se encontró contraseña en MYSQL_PWD. Por favor ingresa la contraseña de MySQL (se ocultará):"
    $secure = Read-Host -AsSecureString
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

# Localizar mysqldump
$mysqldump = $env:MYSQLDUMP_PATH
if (-not $mysqldump -or $mysqldump -eq "") { $mysqldump = "mysqldump" }

# Construir argumentos
$dumpArgs = @(
    "-u", $User,
    "-p$Password",
    "-h", $DbHost,
    "-P", $Port.ToString(),
    "--single-transaction",
    "--routines",
    "--triggers",
    "--events",
    "--hex-blob",
    "--default-character-set=utf8mb4",
    $Database
)

Write-Host "Generando dump de '$Database' en: $outPath (host: $DbHost port: $Port)"

try {
    # Ejecutar mysqldump y redirigir salida al archivo .sql
    & $mysqldump @dumpArgs 2>&1 | Out-File -FilePath $outPath -Encoding utf8
    if ($LASTEXITCODE -ne 0) {
        Write-Error "mysqldump finalizó con código $LASTEXITCODE. Revisa el comando y credenciales."
        Exit $LASTEXITCODE
    }

    # Comprimir a zip
    $zipPath = Join-Path $OutDir ("${Database}_${timestamp}.zip")
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    Compress-Archive -Path $outPath -DestinationPath $zipPath -Force

    # Opcional: eliminar sql sin comprimir
    Remove-Item $outPath -Force

    Write-Host "Backup completado: $zipPath"
} catch {
    Write-Error "Error durante el backup: $_"
    Exit 1
}
