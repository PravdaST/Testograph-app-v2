# Copy missing GIF files from exercisedb-api-main to testograph-v2

$sourceDir = "D:\Automation\All Testograph Ecosystem\exercisedb-api-main\media"
$destDir = "D:\Automation\All Testograph Ecosystem\testograph-v2\public\exercises"

# List of missing GIF IDs
$missingGifs = @(
    'walking', '1jXLYEw', 'lBDjFxJ', 'bWlZvXh', 'eL6Lz0v', 'rjiM4L3',
    '7zdxRTl', '4IKbhHV', 'rjtuP6X', 'dmgMp3n', '0rHfvy9', 'YUYAMEj',
    'W9pFVv1', '1gFNTZV', 'iPm26QU', 'UHJlbu3', 'oHg8eop', 'LIlE5Tn',
    'Fey3oVx', 'PM1PZjg', 'UVo2Qs2', 'sVvXT5J', 'aWedzZX', '2ORFMoR',
    'RJa4tCo', 'yn2lLSI', 'SGY8Zui', 'GibBPPg', '7aVz15j', '17lJ1kr',
    'IeDEXTe', 'PQStVXH', '5bpPTHv', 'GUT8I22', 'u4bAmKp', '25GPyDY',
    'my33uHU', 'ns0SIbU', 'goJ6ezq', 'qRZ5S1N', 'slDvUAU', 'qPEzJjA',
    'F7vjXqT', 'bKWbrTA', '4GqRrAk', 'FVmZVhk', '5uFK1xr', '7vG5o25',
    'G61cXLk', 'bZGHsAZ', 'XUUD0Fs', 'XooAdhl', 'KhHJ338', 'uTBt1HV',
    'T2mxWqc', 'Hgs6Nl1', 'yaMIo4D', 'K5TldTr', 'j7XMAyn', 'dU605di',
    'Qqi7bko', 'fUBheHs', 'W74bXnw', 'TFA88iB', 'trmte8s', 'I3tsCnC',
    'XVDdcoj', 'q2ADGqV', 'AQ0mC4Y', 'yz9nUhF', 'WcHl7ru', 'b6hQYMb', 'qAmNMJY'
)

$copied = 0
$notFound = 0
$alreadyExists = 0

Write-Host "`n🚀 Starting to copy missing GIF files..." -ForegroundColor Cyan
Write-Host "Source: $sourceDir" -ForegroundColor Gray
Write-Host "Destination: $destDir`n" -ForegroundColor Gray

foreach ($gifId in $missingGifs) {
    $sourcePath = Join-Path $sourceDir "$gifId.gif"
    $destPath = Join-Path $destDir "$gifId.gif"

    # Check if already exists in destination
    if (Test-Path $destPath) {
        Write-Host "⏭️  $gifId.gif - Already exists" -ForegroundColor Yellow
        $alreadyExists++
        continue
    }

    # Check if exists in source
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "✅ $gifId.gif - Copied successfully" -ForegroundColor Green
        $copied++
    } else {
        Write-Host "❌ $gifId.gif - Not found in source" -ForegroundColor Red
        $notFound++
    }
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Copy Summary:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
$totalMissing = $missingGifs.Count
Write-Host "Successfully copied: $copied/$totalMissing" -ForegroundColor Green
Write-Host "Already existed: $alreadyExists/$totalMissing" -ForegroundColor Yellow
Write-Host "Not found in source: $notFound/$totalMissing" -ForegroundColor Red
Write-Host ""
