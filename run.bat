@echo off

set /p url=Enter URL:
echo "%url%" > url.txt

node ./server.js
echo Download completed!
pause
