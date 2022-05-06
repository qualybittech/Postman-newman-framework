/***********************************************************************************
 * Program to run the Given PostMan collections and write the required output to CSV file
 * Start set up with 'npm install'
 * Run the script with 'node ./NewmanRunnerWithOutput.js'
 **********************************************************************************/
const { Console } = require('console');
const fs  = require('fs');
const Papa = require('papaparse')
const newman = require('newman');

//const postmanCollcetionFileName = './collcetion.json'
//const iterationDataFileName = './data.csv'
const environmentFileName = './environment.json'

//Add the required collection names for execuution
const postmanCollcetionFiles = ['./collcetion.json','./collcetion2.json']

//Add the mapping test data
const iterationDataFileNames= ['./data.csv','./data2.csv']

//Configure the output which need to be extracted
const outputCollcetion1 = new Map([ 
    ['output1', 'jsonResponseData.page'],
    ['output2', 'jsonResponseData.data[0].first_name'],
    ['output3', 'jsonResponseData.data[0].email'],
  ]);

const outputCollcetion2 = new Map([
    ['output3', 'jsonResponseData.data.email']]);

const outputResArr = [outputCollcetion1, outputCollcetion2] ;

//var indexOfIterationDataFileLine = 0;
//Executing the give collections
for(let i=0;i<postmanCollcetionFiles.length;i++ ){
//Configuring newman library for execution
newman.run({
    collection: require(postmanCollcetionFiles[i]),
    reporters: ['htmlextra'],
    iterationData: iterationDataFileNames[i],
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
            
            let outputMap = new Map();
            var indexOfIterationDataFileLine = args.cursor.iteration;
            var jsonResponseData = JSON.parse(args.response.stream.toString());
            /*Capture the required response details here
            console.log(args.response.stream.toString());
            console.log(jsonResponseData.page);
            console.log(jsonResponseData.data[0].first_name);*/

          /* This code requires updates based on the input collcetion reuqest
            var output1value = jsonResponseData.page;
            var output2value = jsonResponseData.data[0].first_name;
            var output3value = jsonResponseData.data[0].email;
            var outputJSON = {"output1" : output1value, "output2" : output2value, "output3" : output3value};
            
            updateCsvFile(iterationDataFileName,indexOfIterationDataFileLine,outputJSON);*/
         
            //Dynamic data extraction of response and writing it respective output file
           for (let [key, value] of outputResArr[i]) {
              // try{
                   responseValue = eval(value);
                   outputMap.set(key,responseValue);
               /*} catch(e){
                    console.log("Error due to no response or expected response object not exist");
               }     */          
            }
            var outputJSON = Object.fromEntries(outputMap);
            updateCsvFile(iterationDataFileNames[i],indexOfIterationDataFileLine,outputJSON);
            writeToCsvFile('./data3.csv',outputJSON);
        } catch (error) {
            console.error(error);
        }
    }
});
}

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

function writeToCsvFile(fileName,outputJson){
    fs.readFile(fileName,'utf8',(error,data) =>{
        if(error){
            throw error;
        }
        const myCSVData = Papa.unparse([outputJson],{header:false});
        console.log("myCSVData: "+myCSVData);

        fs.appendFileSync(fileName,myCSVData+'\r\n',(error) =>{
            if(error){
                throw error;
            }
        });
});

}

function deleteCSVFile(fileName){
    fs.unlink(fileName, function (err) {
        if (err) throw err;
        console.log('File deleted!');
      });
}
    