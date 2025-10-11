@echo off
echo ========================================
echo    Project Emergence - Launch Script
echo ========================================
echo.
echo Starting Project Emergence Web Interface...
echo.

REM Check if we're in the right directory
if not exist "Web_Interface\index.html" (
    echo Error: Web_Interface\index.html not found!
    echo Please run this script from the Emergence project root directory.
    pause
    exit /b 1
)

REM Try to start a simple HTTP server, or just open the file
echo Attempting to start local server...
python -m http.server 8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ✅ Local server started successfully!
    echo.
    echo 🌐 Opening Project Emergence in your browser...
    echo    URL: http://localhost:8000/Web_Interface/
    echo.
    echo Press Ctrl+C to stop the server when done.
    echo.
    start http://localhost:8000/Web_Interface/
    python -m http.server 8000
) else (
    echo.
    echo ⚠️  Python server not available, opening file directly...
    echo.
    echo 🌐 Opening Project Emergence in your browser...
    echo    File: %cd%\Web_Interface\index.html
    echo.
    start Web_Interface\index.html
)

echo.
echo ========================================
echo    Project Emergence is now running!
echo ========================================
pause
