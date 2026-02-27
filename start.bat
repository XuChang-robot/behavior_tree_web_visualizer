@echo off

REM 启用命令扩展
setlocal enabledelayedexpansion

REM 检查Python是否可用
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Python
    echo 请确保Python已安装并添加到系统环境变量
    pause
    exit /b 1
)

echo 正在启动本地服务器...

REM 启动本地服务器
start "Python HTTP Server" /B python -m http.server 8000

REM 等待服务器启动
echo 等待服务器启动...
timeout /t 3 /nobreak >nul

REM 检查服务器是否启动成功
tasklist | findstr "python" >nul
if %errorlevel% neq 0 (
    echo 错误: 服务器启动失败
    pause
    exit /b 1
)

echo 服务器启动成功！

REM 打开浏览器访问应用
echo 正在打开浏览器...
start http://localhost:8000/

echo 应用已在浏览器中打开
 echo 按任意键关闭服务器...
 pause >nul

REM 关闭服务器
echo 正在关闭服务器...
taskkill /FI "WINDOWTITLE eq Python HTTP Server" /F >nul 2>&1

REM 如果上面的命令失败，尝试使用进程名关闭
if %errorlevel% neq 0 (
    taskkill /IM python.exe /F >nul 2>&1
)

echo 服务器已关闭
pause
