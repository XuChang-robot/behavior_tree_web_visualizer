@echo off
chcp 65001 >nul
echo ==========================================
echo   Behavior Tree Visualizer - Smart Launcher
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js detected
    echo Starting with Node.js...
    node start.js
    exit /b
)

REM Check Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detected
    echo Starting with Python...
    start start.bat
    exit /b
)

REM Check Python3
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python3 detected
    echo Starting with Python3...
    python3 -m http.server 8000
    exit /b
)

echo.
echo ==========================================
echo Error: No runtime environment detected
echo ==========================================
echo.
echo Please install one of the following:
echo.
echo [Recommended] Node.js (faster, more features)
echo   Download: https://nodejs.org/
echo   Double-click this file after installation
echo.
echo [Alternative] Python 3
echo   Download: https://www.python.org/downloads/
echo   Double-click this file after installation
echo.
echo.
pause
