@echo off
setlocal
title Glaze Runner 1.0.4 Gold

:: 1. Move to the folder where the BAT file actually is (M:\Glaze1.04)
cd /d "%~dp0"

:: 2. Set the paths based on your EXACT folder structure
:: Since the BAT is ALREADY inside M:\Glaze1.04, we don't need to repeat the folder name
set "ENGINE_PATH=IMPORTANT\GlazeRunner"
set "ELECTRON=%~dp0%ENGINE_PATH%\node_modules\.bin\electron.cmd"
set "MAIN=%~dp0%ENGINE_PATH%\main.js"

echo [ GLUO 1.04 DEBUG ]
echo Current Path: %~dp0
echo Checking for Electron: "%ELECTRON%"

:: 3. Run it
if exist "%ELECTRON%" (
    echo [ OK ] Launching...
    start "" "%ELECTRON%" "%MAIN%"
) else (
    echo.
    echo [ ERROR ] Still can't find it.
    echo Make sure the "IMPORTANT" folder is in the SAME folder as this .bat
    echo.
    pause
)

