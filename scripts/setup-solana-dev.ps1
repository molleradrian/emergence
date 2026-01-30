# Solana Development Environment Setup Script
# Run this script in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Solana Development Environment Setup" -ForegroundColor Cyan
Write-Host "For Project Emergence" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Rust
Write-Host "[1/3] Installing Rust..." -ForegroundColor Yellow
$rustupUrl = "https://win.rustup.rs/x86_64"
$rustupPath = "$env:TEMP\rustup-init.exe"

try {
    Write-Host "Downloading Rust installer..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $rustupUrl -OutFile $rustupPath -UseBasicParsing
    
    Write-Host "Running Rust installer (this may take a few minutes)..." -ForegroundColor Gray
    Start-Process -FilePath $rustupPath -ArgumentList "-y", "--default-toolchain", "stable" -Wait -NoNewWindow
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "Rust installed successfully!" -ForegroundColor Green
    & "$env:USERPROFILE\.cargo\bin\rustc.exe" --version
    & "$env:USERPROFILE\.cargo\bin\cargo.exe" --version
}
catch {
    Write-Host "Failed to install Rust: $_" -ForegroundColor Red
    Write-Host "Please install manually from: https://rustup.rs" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Install Solana CLI
Write-Host "[2/3] Installing Solana CLI..." -ForegroundColor Yellow
$solanaUrl = "https://release.solana.com/v1.18.26/solana-install-init-x86_64-pc-windows-msvc.exe"
$solanaPath = "$env:TEMP\solana-install-init.exe"

try {
    Write-Host "Downloading Solana installer..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $solanaUrl -OutFile $solanaPath -UseBasicParsing
    
    Write-Host "Running Solana installer..." -ForegroundColor Gray
    Start-Process -FilePath $solanaPath -ArgumentList "v1.18.26" -Wait -NoNewWindow
    
    # Add Solana to PATH
    $solanaDir = "$env:USERPROFILE\.local\share\solana\install\active_release\bin"
    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$solanaDir*") {
        $newPath = $userPath + ";" + $solanaDir
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    }
    
    # Refresh environment
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Write-Host "Solana CLI installed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Failed to install Solana CLI: $_" -ForegroundColor Red
    Write-Host "You may need to restart PowerShell" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Close and reopen PowerShell, then run:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  solana config set --url https://api.devnet.solana.com" -ForegroundColor White
Write-Host "  solana-keygen new --outfile $env:USERPROFILE\.config\solana\devnet.json" -ForegroundColor White
Write-Host "  solana config set --keypair $env:USERPROFILE\.config\solana\devnet.json" -ForegroundColor White
Write-Host "  solana airdrop 2" -ForegroundColor White
Write-Host ""
Write-Host "Then install Anchor (takes 10-15 minutes):" -ForegroundColor Yellow
Write-Host "  cargo install --git https://github.com/coral-xyz/anchor avm --locked --force" -ForegroundColor White
Write-Host "  avm install latest" -ForegroundColor White
Write-Host "  avm use latest" -ForegroundColor White
Write-Host ""
