#!/usr/bin/env npm
chmod +x ./RemEx Linux Starter.sh &&
cd RemEx_Editor/ &&
npm install && (
  npm audit fix --force
  xdg-open http://127.0.0.1:8080/index.html || (
      open http://127.0.0.1:8080/index.html
  )
  npm start
) || (
  echo #
  echo ####################################################################################################
  echo #
  echo ### Could not run the local http-server. Please check if you have Node.js installed.
  echo ### If not visit https://nodejs.org/en/download/. Else reinstall it.
  echo ### Still not working, please contact the support with the information that you had a starter error.
  echo #
  echo ####################################################################################################
  echo #
  # read -n1 -r -p "Press any key to close the server..."
)