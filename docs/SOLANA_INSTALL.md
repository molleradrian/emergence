# Manual Installation Guide for Solana Development

## Quick Installation Commands

Run these commands one at a time in PowerShell:

### 1. Install Rust

```powershell
# Download and run Rust installer
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"
Start-Process -FilePath "$env:TEMP\rustup-init.exe" -ArgumentList "-y" -Wait

# Verify (restart PowerShell first)
rustc --version
cargo --version
```

### 2. Install Solana CLI

```powershell
# Download and run Solana installer
Invoke-WebRequest -Uri "https://release.solana.com/v1.18.26/solana-install-init-x86_64-pc-windows-msvc.exe" -OutFile "$env:TEMP\solana-install.exe"
Start-Process -FilePath "$env:TEMP\solana-install.exe" -ArgumentList "v1.18.26" -Wait

# Add to PATH manually or restart PowerShell
# Verify
solana --version
```

### 3. Configure Solana

```powershell
# Set to devnet
solana config set --url https://api.devnet.solana.com

# Create wallet
solana-keygen new --outfile $env:USERPROFILE\.config\solana\devnet.json

# Set as default
solana config set --keypair $env:USERPROFILE\.config\solana\devnet.json

# Get free devnet SOL
solana airdrop 2

# Check balance
solana balance
```

### 4. Install Anchor (takes 10-15 minutes)

```powershell
# Install Anchor Version Manager
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor
avm install latest
avm use latest

# Verify
anchor --version
```

## Troubleshooting

### Commands not found after installation

- **Solution:** Close and reopen PowerShell
- If still not working, add to PATH manually:
  - Rust: `$env:USERPROFILE\.cargo\bin`
  - Solana: `$env:USERPROFILE\.local\share\solana\install\active_release\bin`

### Airdrop fails

- **Solution:** Wait 30 seconds and try again
- Devnet can be slow sometimes

### Anchor install takes forever

- **Solution:** This is normal! It compiles from source and takes 10-15 minutes
- Don't interrupt it

## Alternative: Use WSL2 (Linux)

If Windows installation is problematic, you can use WSL2:

```bash
# In WSL2 Ubuntu
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

This is often faster and more reliable on Windows.
