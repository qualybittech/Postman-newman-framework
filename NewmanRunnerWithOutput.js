/***********************************************************************************
 * Program to run the PostMan collection and write the required output to CSV file
 * Start set up with 'npm install'
 * Run the script with 'node ./NewmanRunnerWithOutput.js'
 **********************************************************************************/
const { Console } = require('console');
const fs  = require('fs');
const Papa = require('papaparse')
const newman = require('newman');
const postmanCollcetionFileName = './collcetion.json'
const iterationDataFileName = './data.csv'
const environmentFileName = './environment.json'

//Configuring newman library for execution
newman.run({
    collection: require(postmanCollcetionFileName),
    reporters: ['html','htmlextra'],
    iterationData: iterationDataFileName,
    environment: environmentFileName
},(error)=>{
    if(error){
        throw error;
    }
console.log('Collection Execution completed.');
}).on('beforeRequest',(error,data,args) => {
    if(error){
        throw error;
    }else {
        // Capture the request details here if needed
        //console.log(args.request.body.raw);
    }
}).on('request', function (error, args) {
    if (error) {
        console.error(error);
    }
    else {
        try {
            var indexOfIterationDataFileLine = args.cursor.iteration;
            var jsonResponseData = JSON.parse(args.response.stream.toString());

            /*Capture the required response details here
            console.log(args.response.stream.toString());
            console.log(jsonResponseData.page);
            console.log(jsonResponseData.data[0].first_name);*/

            var output1value = jsonResponseData.page;
            var output2value = jsonResponseData.data[0].first_name;
            var output3value = jsonResponseData.data[0].email;
            var outputJSON = {"output1" : output1value, "output2" : output2value, "output3" : output3value};
            
            updateCsvFile(iterationDataFileName,indexOfIterationDataFileLine,outputJSON);
            
        } catch (error) {
            console.error(error);
        }
    }
});

/*Reusable method to read the CSVand write the required output to CSV file */

function updateCsvFile(fileName,rowCount,outputJson){

    fs.readFile(fileName,'utf8',(error,data) =>{
        if(error){
            throw error;
        }
        const jsonData = Papa.parse(data,{header:true});
        
        //Getting all the output values
       for(var mykey in outputJson){
           jsonData.data[rowCount][mykey] = outputJson[mykey];
       }

       const updatedCSV = Papa.unparse(jsonData.data);

        fs.writeFile('./'+fileName,updatedCSV,(error) =>{
            if(error){
                throw error;
            }
        });
    });    
}