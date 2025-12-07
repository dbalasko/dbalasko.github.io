@echo off
REM Build script for compiling LBM solver to WebAssembly
REM Make sure Emscripten is installed and activated before running this

echo Building LBM Solver WebAssembly module...
echo.

emcc lbm-solver.cpp ^
  -o lbm-solver-wasm.js ^
  -std=c++17 ^
  -O3 ^
  -s WASM=1 ^
  -s ALLOW_MEMORY_GROWTH=1 ^
  -s MODULARIZE=1 ^
  -s EXPORT_NAME="Module" ^
  -s EXPORTED_RUNTIME_METHODS="[\"ccall\",\"cwrap\"]" ^
  --bind ^
  -s INITIAL_MEMORY=67108864 ^
  -s MAXIMUM_MEMORY=268435456

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Make sure Emscripten is installed and activated.
    echo Run: emsdk activate latest
    echo Then: emsdk_env.bat
    pause
    exit /b %errorlevel%
)

echo.
echo Build successful!
echo Generated files:
echo   - lbm-solver-wasm.js
echo   - lbm-solver-wasm.wasm
echo.
echo To use the WASM version:
echo 1. Edit index.html and uncomment the WASM script lines
echo 2. Comment out the JavaScript fallback line
echo 3. Serve the files with a local web server (not file://)
echo.
pause
