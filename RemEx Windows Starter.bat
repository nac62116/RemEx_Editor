cd RemEx_Editor/
call npm install && (
  call npm audit fix --force
  call start "" http://127.0.0.1:8080/index.html
  call npm start
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
  pause
)

