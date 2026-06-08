@echo off
title Consola de API de Impresion
echo Cargando API... espere un momento.
:: Esto cierra cualquier instancia previa para que no choque el puerto
taskkill /f /im node.exe >nul 2>&1
start "ServerPOSJ2" /min "%~dp0node.exe" "%~dp0dist\app.js"
exit