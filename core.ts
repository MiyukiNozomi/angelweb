import fs from"fs";
import http from "http";
import path from "path";
import { randomInt } from "crypto";
import { ReplaceAll, ShinoaScript_VERSION } from "./angellib";

let mime : any = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

export let AccessTokens : Map<string,string> = new Map();

export const Server = new http.Server(async function(request, response) {
    var file = "./public" + request.url;

    if (file.includes("?"))
        file = file.substring(0, file.indexOf("?"));

    if (file.endsWith("/"))
        file += "index.shinoa";
    if (file.includes("../")) {
        file = file.replace("../","");
    }

    if (!fs.existsSync(file)) {
        file = file.replace(".shinoa", ".html");
    }

    console.log("request for: " + file);

    //oh no... action!!!
    if (request.url?.endsWith(".sec")) {
        let secFile = request.url?.substring(1, request.url?.length);
        let actionData = config.actions[secFile];

        if (actionData == undefined || actionData.source == undefined) {
            response.writeHead(404);
            response.write(JSON.stringify({
                id: "error-sv-404",
                msg: "the action does not exist or it does not contain a source file."
            }));
            response.end();
            return;
        }

        if (!fs.existsSync("./actions/" + actionData.source + ".js")) {
            response.writeHead(404);
            response.write(JSON.stringify({
                id: "error-sv-404",
                msg: "the source file this action is pointing to doesn't exists."
            }));
            response.end();
            return;
        }
        
        if (actionData.method != undefined && request.method != actionData.method) {
            response.writeHead(404);
            response.write("" + 
            ReplaceAll(
            ReplaceAll(
                fs.readFileSync("./svm.html") + "", "%title%", "ShinoaScript Error!"),
                "%content%","<h2>Invalid Request type.</h2>"));  
            response.end();
            return;
        }

        require("./actions/" + actionData.source + ".js").OnAction(response, request);
        return;
    }

    if (file.endsWith(".shinoa")) {
        try {
            let finalFile : string = fs.readFileSync(file) + "";
            
            finalFile = ReplaceAll(finalFile, "%shinoascript-dynamic_version%",
                ShinoaScript_VERSION);

            while (finalFile.includes("<shinoa exec=\"")) {
                console.log("Script detected!");
                let scriptId = finalFile.substring(finalFile.indexOf("<shinoa exec=\""));
                scriptId = scriptId.substring(0, scriptId.indexOf("\"/>"));
                //console.log("Script tag: " + scriptId);
                finalFile = finalFile.replace(scriptId + "\"/>", "");

                scriptId = scriptId.substring("<shinoa exec=\"".length);
                console.log("executing script: " + scriptId);
                try {
                    finalFile = await require("./" + scriptId).main(finalFile, request, response);
                } catch(err) {
                    response.statusCode = 505;
                    response.write("" + 
                    ReplaceAll(
                    ReplaceAll(
                        fs.readFileSync("./svm.html") + "", "%title%", "ShinoaScript Error!"),
                        "%content%","<h2>If you are the owner, please check the server's console.</h2>"));    
                    response.setHeader("Content-Type", "text/html");
                    console.log("shinoascript exception catched --------\n" + err, "\n----------");
                    response.end();
                }
                console.log(finalFile);
            }

            response.writeHead(200);
            response.write(finalFile);
            response.end();
            return;
        } catch(err) {
            response.statusCode = 404;
            response.write("" + 
                ReplaceAll(
                ReplaceAll(
                    fs.readFileSync("./svm.html") + "", "%title%", "Not Found"),
                    "%content%","<h2>the request for \"" + request.url + "\" was not found.</h2>"));        
            response.end();  
            console.log("Error error!" + err);
        }

        return;
    }

    try {
        var type = mime[path.extname(file).slice(1)] || 'text/plain';
        var s = fs.createReadStream(file);
        s.on('open', function () {
            response.setHeader('Content-Type', type);
            s.pipe(response);
        });
        s.on('error', function () {
            response.statusCode = 404;
            response.write("" + 
            ReplaceAll(
            ReplaceAll(
                fs.readFileSync("./svm.html") + "", "%title%", "Not Found"),
                "%content%","<h2>the request for \"" + request.url + "\" was not found.</h2>"));     
            response.end();  
        });
    } catch (error) {
        response.statusCode = 505;
        response.write("" + 
        ReplaceAll(
        ReplaceAll(
            fs.readFileSync("./svm.html") + "", "%title%", "Internal ServerError"),
            "%content%","<h2>An exception was catched. if you are the owner, please check the server's console.</h2>"));    
        response.setHeader("Content-Type", "text/html");
        console.log(error);
        response.end();
    }

    
});

let config = require("./angelprocessor.config.json");

Server.listen(config.port);
console.log("Server loaded at https://localhost:" + config.port + "/");
console.log("Loaded with: " + Object.keys(config.actions).length + " Actions.");