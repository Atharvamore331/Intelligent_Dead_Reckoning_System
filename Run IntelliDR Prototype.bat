@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

set "PORT=8000"
set "TARGET=http://localhost:%PORT%/intellidr_admin_dashboard/code.html"

where py >nul 2>&1
if not errorlevel 1 (
    set "PYCMD=py"
) else (
    where python >nul 2>&1
    if not errorlevel 1 (
        set "PYCMD=python"
    ) else (
        echo Python was not found on PATH.
        echo Please install Python from https://www.python.org/downloads/
        pause
        exit /b 1
    )
)

for /f "skip=5 tokens=5" %%P in ('netstat -ano -p tcp ^| findstr /R /C:":%PORT% " 2^>nul') do (
    if not "%%P"=="" (
        taskkill /PID %%P /F >nul 2>&1
    )
)

start "IntelliDR Prototype Server" cmd /c "%PYCMD% -m http.server %PORT% > server.log 2>&1"

ping -n 2 127.0.0.1 >nul
start "" "%TARGET%"

echo IntelliDR prototype is starting...
echo Opened: %TARGET%

timeout /t 2 >nul
exit /b 0
