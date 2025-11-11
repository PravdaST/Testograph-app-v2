# Copy similar GIF files for the 5 remaining exercises

$sourceDir = "D:\Automation\All Testograph Ecosystem\exercisedb-api-main\media"
$destDir = "D:\Automation\All Testograph Ecosystem\testograph-v2\public\exercises"

# Map missing exercises to similar alternatives from the database
$gifMappings = @{
    # walking - use any cardio/walking alternative
    'walking' = '03lzqwk'  # walking exercise alternative

    # eL6Lz0v - Високи колене (high knees)
    'eL6Lz0v' = 'LIlE5Tn'  # jump squat - dynamic cardio movement

    # Fey3oVx - Планински катерач (mountain climber)
    'Fey3oVx' = 'PM1PZjg'  # jump lunge - similar cardio movement

    # K5TldTr - Разперки с дъмбели (dumbbell fly)
    'K5TldTr' = 'yz9nUhF'  # dumbbell fly - exact match alternative

    # W74bXnw - Къдрене с дъмбели на пейка (incline dumbbell curl)
    'W74bXnw' = 'qAmNMJY'  # dumbbell curl - similar exercise
}

$copied = 0
$failed = 0

Write-Host "`n🔍 Finding similar GIF alternatives for 5 remaining exercises..." -ForegroundColor Cyan
Write-Host "Source: $sourceDir" -ForegroundColor Gray
Write-Host "Destination: $destDir`n" -ForegroundColor Gray

foreach ($target in $gifMappings.Keys) {
    $sourceId = $gifMappings[$target]
    $sourcePath = Join-Path $sourceDir "$sourceId.gif"
    $destPath = Join-Path $destDir "$target.gif"

    Write-Host "📌 $target → $sourceId" -ForegroundColor Yellow

    # Check if source exists
    if (Test-Path $sourcePath) {
        # Copy and rename to target ID
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "   ✅ Copied successfully`n" -ForegroundColor Green
        $copied++
    } else {
        Write-Host "   ❌ Source not found: $sourceId.gif`n" -ForegroundColor Red
        $failed++
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Copy Summary:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Successfully copied: $copied/5" -ForegroundColor Green
Write-Host "Failed: $failed/5" -ForegroundColor Red
Write-Host ""
