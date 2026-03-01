@echo off
setlocal
title Glaze Runner 1.04 - Universal Launcher

:: This gets the drive and path of the BAT file itself
set "ROOT_DIR=%~dp0"

:: Set the paths relative to the BAT location
:: This works on C:, D:, M:, or even a USB Thumb Drive!
set "MAIN_FILE=%ROOT_DIR%Glaze1.04\IMPORTANT\GlazeRunner\main.js"
set "ELECTRON_PATH=%ROOT_DIR%Glaze1.04\IMPORTANT\GlazeRunner\node_modules\.bin\electron.cmd"

echo [ System Check ]
echo Root Directory: %ROOT_DIR%
echo Looking for Electron...

:: Check if Electron exists in this specific path
if exist "%ELECTRON_PATH%" (
    echo [ Success ] Launching Glaze 1.0.4...
    start "" "%ELECTRON_PATH%" "%MAIN_FILE%"
) else (
    echo.
    echo [ ERROR ] Electron not found! 
    echo Please run 'npm install' inside:
    echo %ROOT_DIR%Glaze1.04\IMPORTANT\GlazeRunner\
    echo.
    pause
)
