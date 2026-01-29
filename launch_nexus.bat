@echo off
title Launching Aetherium Nexus...
echo Starting the Aetherium Neural Link...

:: Navigate to project directory
cd /d "C:\Users\juanita\Desktop\Emergence"

:: Start the Dev Server in a new window (minimized)
start /min cmd /c "npm run dev"

:: Wait for server to initialize
echo Waiting for initialization (5s)...
timeout /t 5 /nobreak > nul

:: Open the browser to the Nexus
echo Opening local access point...
start http://localhost:3000

echo.
echo Nexus is now live at http://localhost:3000
echo You can close this window.
timeout /t 3 > nul
exit
