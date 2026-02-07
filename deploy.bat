@echo off
set /p msg="Enter commit message (default: Update portfolio): "
if "%msg%"=="" set msg=Update portfolio

echo.
echo [1/3] Adding changes...
git add .

echo.
echo [2/3] Committing...
git commit -m "%msg%"

echo.
echo [3/3] Pushing to GitHub (main branch)...
git push origin main

echo.
echo =======================================
echo Deployment Complete! 
echo Check your GitHub Actions tab for progress.
echo =======================================
pause
