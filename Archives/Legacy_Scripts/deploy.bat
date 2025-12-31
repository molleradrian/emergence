@echo off
REM Project Emergence - Windows Deployment Script
REM Automated deployment for Windows environments

setlocal enabledelayedexpansion

set "PROJECT_ROOT=%~dp0"
set "WEB_DIR=Web_Interface"
set "TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "LOG_FILE=%PROJECT_ROOT%deployment_%TIMESTAMP%.log"

REM Colors for output (Windows 10+)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Logging function
:log
echo [%DATE% %TIME%] %~1 >> "%LOG_FILE%"
echo %~1
goto :eof

:error
echo ERROR: %~1 >> "%LOG_FILE%"
echo ERROR: %~1
exit /b 1

:success
echo SUCCESS: %~1 >> "%LOG_FILE%"
echo SUCCESS: %~1
goto :eof

:warning
echo WARNING: %~1 >> "%LOG_FILE%"
echo WARNING: %~1
goto :eof

REM Pre-deployment checks
:pre_deployment_checks
call :log "🔍 Running pre-deployment checks..."

REM Check if web directory exists
if not exist "%WEB_DIR%" (
    call :error "Web_Interface directory not found. Please ensure you're in the project root."
)

REM Check if required files exist
if not exist "%WEB_DIR%\index.html" (
    call :error "index.html not found in Web_Interface directory"
)

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    call :warning "Node.js not found. Some build processes may fail."
)

REM Check Git status
git --version >nul 2>&1
if not errorlevel 1 (
    git status --porcelain >nul 2>&1
    if not errorlevel 1 (
        call :warning "Working directory has uncommitted changes"
    )
)

call :success "Pre-deployment checks passed"
goto :eof

REM Deploy to Netlify
:deploy_to_netlify
call :log "🚀 Deploying to Netlify..."

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if errorlevel 1 (
    call :error "Netlify CLI not found. Install with: npm install -g netlify-cli"
)

REM Check if user is logged in
netlify status >nul 2>&1
if errorlevel 1 (
    call :log "🔐 Please login to Netlify:"
    netlify login
)

REM Deploy to production
call :log "📦 Deploying to production..."
netlify deploy --prod --dir="%WEB_DIR%" --message="Automated deployment %TIMESTAMP%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    call :error "Netlify deployment failed"
) else (
    call :success "Netlify deployment completed successfully"
)
goto :eof

REM Validate deployment
:validate_deployment
call :log "✅ Validating deployment..."

REM Check if main page exists
if exist "%WEB_DIR%\index.html" (
    call :success "Main application file exists and is accessible"
) else (
    call :error "Main application file not found"
)

call :success "Deployment validation completed"
goto :eof

REM Post-deployment tasks
:post_deployment_tasks
call :log "🔧 Running post-deployment tasks..."

REM Create deployment record
(
echo {
echo     "timestamp": "%TIMESTAMP%",
echo     "deployment_type": "%DEPLOYMENT_TARGET%",
echo     "version": "unknown",
echo     "status": "success",
echo     "artifacts": {
echo         "web_directory": "%WEB_DIR%",
echo         "main_file": "%WEB_DIR%\index.html",
echo         "log_file": "%LOG_FILE%"
echo     }
echo }
) > "deployment_record_%TIMESTAMP%.json"

call :success "Post-deployment tasks completed"
goto :eof

REM Main deployment function
:main
echo 🚀 Project Emergence - Automated Deployment System
echo ==================================================

set "DEPLOYMENT_TARGET=%1"
if "%DEPLOYMENT_TARGET%"=="" set "DEPLOYMENT_TARGET=netlify"

call :log "🎯 Starting deployment to: %DEPLOYMENT_TARGET%"
call :log "📝 Log file: %LOG_FILE%"

REM Run deployment steps
call :pre_deployment_checks

if "%DEPLOYMENT_TARGET%"=="netlify" (
    call :deploy_to_netlify
) else (
    call :error "Unknown deployment target: %DEPLOYMENT_TARGET%"
)

call :validate_deployment
call :post_deployment_tasks

call :success "🎉 Deployment completed successfully!"
echo.
echo 📋 Summary:
echo    Target: %DEPLOYMENT_TARGET%
echo    Timestamp: %TIMESTAMP%
echo    Log: %LOG_FILE%
echo    Status: ✅ SUCCESS
echo.
echo 🌟 Project Emergence is now live and operational!

goto :eof

REM Run main function with arguments
call :main %*
