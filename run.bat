@echo off

:: Prompt for the URL
set /p url=Enter URL:

:: Prompt for the option
set /p option=Enter option v(video), a(audio) and empty for both:

:: Handle empty option
if "%option%" == "" (
  set option=null
)

:: Run the Node.js script
node ./server.js "%url%" %option%

:: Check if the Node.js script was successful
if %errorlevel% == 0 (
  echo Download completed! Press any key to open Downloads directory.
  pause

  :: Open the Downloads directory
  explorer Downloads
) else (
  echo Download failed!
  pause
)


