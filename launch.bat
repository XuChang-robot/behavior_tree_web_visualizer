@echo off
chcp 65001 >nul
echo ========================================
echo   Behavior Tree Visualizer Launcher
echo ========================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Node.js detected, starting with Node.js...
    echo.
    node start.js
    goto :end
)

REM Check if Python is available
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python detected, starting with Python...
    echo.
    python -m http.server 8000
    goto :end
)

REM Check if Python3 is available
where python3 >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python3 detected, starting with Python3...
    echo.
    python3 -m http.server 8000
    goto :end
)

echo [ERROR] Neither Node.js nor Python found!
echo Please install Node.js or Python to run this application.
echo.
pause

:end
