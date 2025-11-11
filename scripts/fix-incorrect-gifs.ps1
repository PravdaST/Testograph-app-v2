# Fix the 4 incorrectly mapped GIF files with proper alternatives

$sourceDir = "D:\Automation\All Testograph Ecosystem\exercisedb-api-main\media"
$destDir = "D:\Automation\All Testograph Ecosystem\testograph-v2\public\exercises"

# Correct mappings based on visual verification
$correctMappings = @{
    # walking in place -> ski step (cardio stepping motion)
    'walking' = '5MRH8H2'

    # high knees -> high knee against wall
    'eL6Lz0v' = 'ealLwvX'

    # mountain climber -> actual mountain climber
    'Fey3oVx' = 'RJgzwny'

    # incline dumbbell curl -> dumbbell incline curl
    'W74bXnw' = 'ae9UoXQ'
}

$fixed = 0
$failed = 0

Write-Host ""
Write-Host "Fixing 4 incorrectly mapped GIF files..." -ForegroundColor Cyan
Write-Host "Source: $sourceDir" -ForegroundColor Gray
Write-Host "Destination: $destDir" -ForegroundColor Gray
Write-Host ""

foreach ($target in $correctMappings.Keys) {
    $sourceId = $correctMappings[$target]
    $sourcePath = Join-Path $sourceDir "$sourceId.gif"
    $destPath = Join-Path $destDir "$target.gif"

    Write-Host "Replacing $target with $sourceId" -ForegroundColor Yellow

    if (Test-Path $sourcePath) {
        # Backup old file first
        $backupPath = Join-Path $destDir "$target.gif.backup"
        if (Test-Path $destPath) {
            Copy-Item -Path $destPath -Destination $backupPath -Force
            Write-Host "   Backed up old file" -ForegroundColor Gray
        }

        # Copy correct GIF
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "   Fixed successfully" -ForegroundColor Green
        Write-Host ""
        $fixed++
    } else {
        Write-Host "   Source not found: $sourceId.gif" -ForegroundColor Red
        Write-Host ""
        $failed++
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Fix Summary:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Successfully fixed: $fixed/4" -ForegroundColor Green
Write-Host "Failed: $failed/4" -ForegroundColor Red

if ($fixed -eq 4) {
    Write-Host ""
    Write-Host "All GIF animations are now correct!" -ForegroundColor Green
}

Write-Host ""
