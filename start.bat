@echo off
chcp 65001 >nul
echo ==========================================
echo   Behavior Tree Visualizer - Start Script
echo ==========================================
echo.

REM Check if port 8000 is in use
netstat -an | findstr ":8000" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo Port 8000 is already in use, trying to stop existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
        echo Stopped process %%a
    )
    timeout /t 1 /nobreak >nul
)

echo Starting server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detected
    echo Starting server with Python...
    python -m http.server 8000
    exit /b
)

REM Check if Python3 is available
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python3 detected
    echo Starting server with Python3...
    python3 -m http.server 8000
    exit /b
)

REM Check if py is available
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] py detected
    echo Starting server with py...
    py -m http.server 8000
    exit /b
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Detected Node.js, using npx serve...
    npx serve -l 8000
    exit /b
)

echo.
echo ==========================================
echo Error: Cannot start server
echo ==========================================
echo.
echo Please ensure one of the following environments is installed:
echo   1. Python (python, python3, or py)
echo   2. Node.js (will use npx serve)
echo.
echo Install Python: https://www.python.org/downloads/
echo Install Node.js: https://nodejs.org/
echo.
pause
exit /b 1
