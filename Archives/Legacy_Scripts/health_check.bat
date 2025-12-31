@echo off
REM Project Emergence - Quick Health Check Script (Windows)
REM This script performs basic health checks on the Project Emergence system

echo 🧠 Project Emergence - Health Check
echo ==================================
echo.

REM Check if Python is available
echo ✓ Checking Python installation...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo   Python is available: 
    python --version
) else (
    echo   ❌ Python is not available
    pause
    exit /b 1
)

echo.
echo ✓ Checking project structure...
if exist "Web_Interface" (
    echo   Web_Interface directory exists
) else (
    echo   ❌ Web_Interface directory missing
)

if exist "Development" (
    echo   Development directory exists
) else (
    echo   ❌ Development directory missing
)

echo.
echo ✓ Checking core files...
set "files=serve.py README.md Web_Interface\index.html"
for %%f in (%files%) do (
    if exist "%%f" (
        echo   %%f exists
    ) else (
        echo   ❌ %%f missing
    )
)

echo.
echo ✓ Testing web server configuration...
cd Web_Interface >nul 2>&1
if %errorlevel% equ 0 (
    echo   Can navigate to Web_Interface directory
    cd ..
) else (
    echo   ❌ Cannot navigate to Web_Interface directory
)

REM Check favicon
if exist "Web_Interface\favicon.svg" (
    echo   Custom favicon exists
) else (
    echo   ❌ Custom favicon missing
)

echo.
echo 🎉 Health check completed!
echo.
echo To start the development server:
echo   python serve.py
echo.
echo To view in browser:
echo   Open http://localhost:8000 in your browser
echo.
pause
