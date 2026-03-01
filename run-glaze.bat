@echo off
setlocal
title Glaze Runner 1.04 - Universal Launcher

:: 1. Move the terminal's focus to the folder where THIS bat file is
:: /d is critical: it allows switching between different drives (like M: to C:)
cd /d "%~dp0"

:: 2. Set the relative path to the internal engine folder
:: We use quotes around the SET to handle spaces in folder names safely
set "ENGINE_DIR=Glaze1.04\IMPORTANT\GlazeRunner"

echo [ System Check ]
echo Current Drive: %~d0
echo Engine Path: %ENGINE_DIR%

:: 3. Check if the Electron CMD exists before trying to run it
if exist "%ENGINE_DIR%\node_modules\.bin\electron.cmd" (
    echo [ Success ] Launching Glaze 1.0.4 Gold...
    
    :: We use START "" to launch Electron so the CMD window doesn't hang
    start "" "%ENGINE_DIR%\node_modules\.bin\electron.cmd" "%ENGINE_DIR%\main.js"
) else (
    echo.
    echo [ ERROR ] Electron not found!
    echo.
    echo 1. Open CMD
    echo 2. Type: cd /d "%~dp0%ENGINE_DIR%"
    echo 3. Type: npm install
    echo.
    pause
)
