# Postman-newman-framework
 Project for running postman collection and generate HTML reports. Also parse the required response data and write it to CSV file

    Pre-requsites:
      1) NodeJS
      2) npm
      3) Visual studio code
      4) Postman
    
    Steps:
      1) Open the terminal and hit "npm install"
      2) Export the required collection / Envrionment from Postman
      3) Configure the Collcetion name and environment config in "NewmanRunnerWithOutput.js" file
      4) Configur required response data in On "reuest" function
      5) Run the script using commnand "node NewmanRunnerWithOutput.js"
      6) Data would be outputted to CSV file and HTML result would be generated
