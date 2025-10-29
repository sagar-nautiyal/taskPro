# PowerShell script to remove console.log statements from JavaScript/JSX files

$clientPath = "d:\Full Stack\Projects\TaskPro-2\taskpro-client\taskpro-client\src"
$serverPath = "d:\Full Stack\Projects\TaskPro-2\taskpro-server"

# Function to remove console statements from a file
function Remove-ConsoleLogs {
    param([string]$filePath)
    
    $content = Get-Content $filePath -Raw
    
    # Remove single-line console statements
    $content = $content -replace '(?m)^\s*console\.(log|error|warn|info|debug)\([^;]*\);\s*$\r?\n?', ''
    
    # Remove multi-line console statements
    $content = $content -replace '(?ms)console\.(log|error|warn|info|debug)\(\s*\n[^)]*\n\s*\);?\s*\r?\n?', ''
    
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "Cleaned: $filePath"
}

# Clean client files
Write-Host "Cleaning client files..."
Get-ChildItem -Path $clientPath -Include *.js,*.jsx -Recurse | ForEach-Object {
    Remove-ConsoleLogs $_.FullName
}

# Clean server files
Write-Host "Cleaning server files..."
Get-ChildItem -Path $serverPath -Include *.js,*.jsx -Recurse -Exclude node_modules | ForEach-Object {
    Remove-ConsoleLogs $_.FullName
}

Write-Host "Console logs cleaned successfully!"
