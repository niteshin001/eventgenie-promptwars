@echo off
title EventGenie AI - Celebration Planner
echo ==============================================================
echo ✨ Starting EventGenie AI - Your Celebration, Perfectly Planned
echo ==============================================================
echo.

REM Look for python in standard locations
set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
        set PYTHON_CMD="%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set PYTHON_CMD="%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    ) else (
        echo [ERROR] Python not found in PATH or standard LocalAppData location.
        pause
        exit /b 1
    )
)

echo Using Python: %PYTHON_CMD%
echo Opening application in browser...
start http://127.0.0.1:8000

%PYTHON_CMD% run.py
pause
