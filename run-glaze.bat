@echo off
setlocal
REM This is where your BAT file sits (M:\Glaze1.04)
set "ROOT_DIR=%~dp0"

REM Updated path to match your "Double Folder" structure
set "MAIN_FILE=%ROOT_DIR%Glaze1.04\IMPORTANT\GlazeRunner\main.js"

REM Updated path to where Electron is actually installed
set "ELECTRON_PATH=%ROOT_DIR%Glaze1.04\IMPORTANT\GlazeRunner\node_modules\.bin\electron.cmd"

echo Checking path: %MAIN_FILE%

if exist "%ELECTRON_PATH%" (
    echo Launching Glaze 1.0.4...
    "%ELECTRON_PATH%" "%MAIN_FILE%"
) else (
    echo.
    echo ERROR: Cannot find Electron at the expected location!
    echo Tried: %ELECTRON_PATH%
    echo.
    echo Please ensure your "IMPORTANT" folder is inside: 
    echo %ROOT_DIR%Glaze1.04\
    pause
)