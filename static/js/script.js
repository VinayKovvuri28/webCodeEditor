// editor
var editor = CodeMirror.fromTextArea(document.getElementById("editor"),{
    mode:"text/x-csrc",
    theme: "dracula",
    lineNumbers:true,
    autoCloseBrackects:true,
});

// editor width
var width = window.innerWidth;
editor.setSize(0.7*width, "500");

// language
var langOption = document.getElementById("language");
langOption.addEventListener("change", function(){
    if(langOption.value == "CPP"){
        editor.setOption("mode","text/x-c++src");
    }
    else if(langOption.value == "Java"){
        editor.setOption("mode","text/x-java");
    }
    else if(langOption.value == "Python"){
        editor.setOption("mode","text/x-python");
    }
    else {
        editor.setOption("mode","text/x-csrc");
    }
});

//theme
var themeOption = document.getElementById("theme");
themeOption.addEventListener("change", function(){
    if(themeOption.value == "1"){
        editor.setOption("theme","ambiance");
    }
    else if(themeOption.value == "2"){
        editor.setOption("theme","cobalt");
    }
    else if(themeOption.value == "3"){
        editor.setOption("theme","Colorforth");
    }
    else if(themeOption.value == "5"){
        editor.setOption("theme","eclipse");
    }
    else if(themeOption.value == "6"){
        editor.setOption("theme","midnight");
    }
    else if(themeOption.value == "7"){
        editor.setOption("theme","monokai");
    }
    else if(themeOption.value == "8"){
        editor.setOption("theme","solarized dark");
    }
    else if(themeOption.value == "9"){
        editor.setOption("theme","solarized light");
    }
    else if(themeOption.value == "10"){
        editor.setOption("theme","xq-light");
    }
    else{
        editor.setOption("theme","dracula");
    }
})
// getting inout, output, run from html
var input = document.getElementById("input");
var output = document.getElementById("output");
var run = document.getElementById("run");

var code;
run.addEventListener("click",async function(){
    code = {
        code:editor.getValue(),
        input:input.value,
        lang:langOption.value
    }
    var oData=await fetch("http://localhost:2023/compiler",{
        method:"POST",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify(code)
    });
    var d = await oData.json();
    output.value = d.output
});