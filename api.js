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
        console.log("deleted");
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

app.post("/compiler", function(req,res){
    var code = req.body.code
    var input = req.body.input
    var lang = req.body.lang

    var OS = initCompiler().OS;

    if(OS === 'win32'){ 
        var cmd ="g++" //uses g++ command to compile
    }
    else if(OS === 'linux'){
        var cmd = "gcc" //uses gcc command to compile
    }
    try{
        if(lang==='CPP'){
            if(!input){
                var envData = { OS : OS, cmd : cmd, options:{timeout:1000} };
                compiler.compileCPP(envData , code , function (data) {
                    if(data.output){
                        res.send(data)
                    }
                    else{
                        res.send({output:"Error.....!"})
                    }
                });
                
                //res is the response object
            }
            else{
                var envData = { OS : OS , cmd : cmd, options:{timeout:1000} };
                compiler.compileCPPWithInput(envData , code , input , function (data) {
                    if(data.output){
                        res.send(data)
                    }
                    else{
                        res.send({output:"Error.....!"})
                    }
                });
            }
        }
        else if(lang==='Java'){
            if(!input){
                var envData = { OS : OS };
                compiler.compileJava( envData , code , function(data){
                    if(data.output){
                        res.send(data)
                    }
                    else{
                        res.send({output:"Error.....!"})
                    }
                }); 
                //res is the response object
            }
            else{
                var envData = { OS : OS };
                compiler.compileJavaWithInput( envData , code , input ,  function(data){
                    if(data.output){
                        res.send(data)
                    }
                    else{
                        res.send({output:"Error.....!"})
                    }
                });
            }
        }
        if(lang === 'Python'){
            if(!input){
                var envData = { OS : OS };
                compiler.compilePython( envData , code , function(data){
                    if(data.output){
                        res.send(data)
                    }
                    else{
                        res.send({output:"Error.....!"})
                    }
                }); 
                            
                //res is the response object
            }
            else{
                var envData = { OS : OS };
                compiler.compilePythonWithInput( envData , code , input ,  function(data){
                    if(data.output){
                        res.send(data)
                    }
                    else{
                        res.send({output:"Error.....!"})
                    }        
                });
            }
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