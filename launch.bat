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

REM Start the API server
echo Starting Emergence API Server...
echo.
echo 🌐 Opening Project Emergence in your browser...
echo    URL: http://localhost:8000/Web_Interface/
echo.
echo Press Ctrl+C to stop the server.
echo.
echo ========================================
echo    Project Emergence is now running!
echo ========================================
echo.
start http://localhost:8000/Web_Interface/
python server_api.py || (
    echo.
    echo ⚠️  Python server not available, opening file directly...
    echo.
    echo 🌐 Opening Project Emergence in your browser...
    echo    File: %cd%\Web_Interface\index.html
    echo.
    start Web_Interface\index.html
)

echo.
pause
