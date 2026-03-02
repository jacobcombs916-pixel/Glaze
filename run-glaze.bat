@echo off
title GLUO 1.04 - ENGINE START
cd /d "%~dp0"

:: THE PATHS YOU PROVIDED:
:: Root: M:\Glaze1.04
:: Electron: M:\Glaze1.04\Glaze1.04\IMPORTANT\GlazeRunner\node_modules\electron\dist\electron.exe

set "EL_EXE=%~dp0Glaze1.04\IMPORTANT\GlazeRunner\node_modules\electron\dist\electron.exe"
set "APP_JS=%~dp0Glaze1.04\IMPORTANT\GlazeRunner\main.js"

echo [DEBUG] Checking Electron: "%EL_EXE%"
echo [DEBUG] Checking Script: "%APP_JS%"

:: Check if the EXE exists
if exist "%EL_EXE%" (
    echo [FOUND] Launching Gluo 1.04...
    start "" "%EL_EXE%" "%APP_JS%"
) else (
    echo [ERROR] The path is still wrong. 
    echo Windows cannot find: "%EL_EXE%"
    echo.
    echo Make sure you didn't rename the 'Glaze1.04' subfolder.
    pause
)
