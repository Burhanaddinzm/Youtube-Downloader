@echo off

set /p url=Enter URL:
echo "%url%" > url.txt

node ./server.js
echo Download completed! Press any key to open Downloads directory.
pause
explorer Downloads