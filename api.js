const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// compilex
const compiler = require("compilex");
const options = {stats:true}; //prints stats on console
compiler.init(options);

const app = express();
const port = process.env.PORT || 2023;

// Use JSON bodyParser middleware
app.use(bodyParser.json());

// Serve static files
const staticPath = path.join(__dirname, "static");
app.use("/static", express.static(staticPath));

// Serve the index.html file
const indexPath = path.join(__dirname, "index.html");

app.get("/", (req, res) => {
    compiler.flush(function(){
        console.log("Compiled File Deleted");
    });
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

// Compiler initialization
const initCompiler = () => {
    return { OS: process.platform }; // 'process.platform' gives the current operating system
};

// Function to handle compilation output logging
const logCompilationOutput = (data) => {
    console.log("Compilation output:", data.output);
};

app.post("/compiler", function(req,res){
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;

    var OS = initCompiler().OS;
    let cmd;

    if(OS === 'win32'){ 
        cmd ="g++" //uses g++ command to compile
    }
    else if(OS === 'linux'){
        cmd = "gcc" //uses gcc command to compile
    }

    try {
        if (lang === 'CPP' || lang === 'C') {
            var envData = { OS : OS, cmd : cmd, options:{timeout:10000} };
            if(!input){ 
                compiler.compileCPP(envData , code , function (data) {
                    logCompilationOutput(data);
                    if(data.output){
                        res.send(data);
                    }
                    else{
                        res.send({output:"Error during compilation"});
                    }
                });   
                //res is the response object
            }
            else {
                compiler.compileCPPWithInput(envData , code , input , function (data) {
                    logCompilationOutput(data);
                    if(data.output){
                        res.send(data);
                    }
                    else{
                        res.send({output:"Error during compilation"});
                    }
                });
            }
        }
        else if(lang==='Java'){
            var envData = { OS : OS };
            if(!input){    
                compiler.compileJava( envData , code , function(data){
                    logCompilationOutput(data);
                    if(data.output){
                        res.send(data);
                    }
                    else{
                        res.send({output:"Error during compilation"});
                    }
                }); 
                //res is the response object
            }
            else{
                compiler.compileJavaWithInput( envData , code , input ,  function(data){
                    logCompilationOutput(data);
                    if(data.output){
                        res.send(data);
                    }
                    else{
                        res.send({output:"Error during compilation"});
                    }
                });
            }
        }
        else if(lang === 'Python'){
            var envData = { OS : OS };
            if(!input){
                compiler.compilePython( envData , code , function(data){
                    logCompilationOutput(data);
                    if(data.output){
                        res.send(data);
                    }
                    else{
                        res.send({output:"Error during compilation"});
                    }
                }); 
                            
                //res is the response object
            }
            else{
                compiler.compilePythonWithInput( envData , code , input ,  function(data){
                    logCompilationOutput(data);
                    if(data.output){
                        res.send(data);
                    }
                    else{
                        res.send({output:"Error during compilation"});
                    }        
                });
            }
        }
        else {
            res.status(400).send("Unsupported language");
        }
    }
    catch(e){
        console.log("Error..........!", e);
        res.status(500).send("Internal Server Error");
    }    
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});