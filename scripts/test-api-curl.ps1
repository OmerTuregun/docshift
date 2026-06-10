# DocShift REST API test (PowerShell)
# Kullanım:
#   $env:DOCSHIFT_API_KEY = "ds_live_..."
#   .\scripts\test-api-curl.ps1 -File "C:\path\to\document.xlsx"

param(
  [string]$BaseUrl = "http://localhost:3030",
  [string]$File = "",
  [string]$OutputFormat = "json"
)

if (-not $env:DOCSHIFT_API_KEY) {
  Write-Error "DOCSHIFT_API_KEY ortam degiskeni gerekli."
  exit 1
}

if (-not $File) {
  Write-Error "-File parametresi gerekli. Ornek: -File .\ornek.xlsx"
  exit 1
}

if (-not (Test-Path $File)) {
  Write-Error "Dosya bulunamadi: $File"
  exit 1
}

$uri = "$BaseUrl/api/v1/convert"
$headers = @{ Authorization = "Bearer $env:DOCSHIFT_API_KEY" }

try {
  $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Form @{
    file         = Get-Item $File
    outputFormat = $OutputFormat
  }

  Write-Host "Basarili!" -ForegroundColor Green
  $response | ConvertTo-Json -Depth 5
}
catch {
  Write-Error $_.Exception.Message
  if ($_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message
  }
  exit 1
}
