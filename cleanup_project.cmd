@echo off
echo Iniciando limpieza de la raiz del proyecto...

:: Eliminar node_modules en la raiz si existe
IF EXIST "node_modules" (
    echo Eliminando carpeta node_modules en la raiz...
    rmdir /s /q "node_modules"
) ELSE (
    echo node_modules no encontrado en la raiz.
)

:: Eliminar package.json en la raiz si existe
IF EXIST "package.json" (
    echo Eliminando archivo package.json en la raiz...
    del "package.json"
) ELSE (
    echo package.json no encontrado en la raiz.
)

:: Eliminar package-lock.json en la raiz si existe
IF EXIST "package-lock.json" (
    echo Eliminando archivo package-lock.json en la raiz...
    del "package-lock.json"
) ELSE (
    echo package-lock.json no encontrado en la raiz.
)

:: Eliminar el script de limpieza anterior si existe (clean_root.cmd)
IF EXIST "clean_root.cmd" (
    echo Eliminando script clean_root.cmd en la raiz...
    del "clean_root.cmd"
) ELSE (
    echo clean_root.cmd no encontrado en la raiz.
)

:: Puedes añadir mas reglas aqui para otros archivos/carpetas basura si los detectas en el futuro.
:: Por ejemplo:
:: IF EXIST ".angular" (
::     echo Eliminando carpeta .angular en la raiz...
::     rmdir /s /q ".angular"
:: )

echo Limpieza de la raiz completada.
