"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.AccessTokens = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const angellib_1 = require("./angellib");
let mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
exports.AccessTokens = new Map();
exports.Server = new http_1.default.Server(function (request, response) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        var file = "./public" + request.url;
        if (file.includes("?"))
            file = file.substring(0, file.indexOf("?"));
        if (file.endsWith("/"))
            file += "index.shinoa";
        if (file.includes("../")) {
            file = file.replace("../", "");
        }
        if (!fs_1.default.existsSync(file)) {
            file = file.replace(".shinoa", ".html");
        }
        console.log("request for: " + file);
        //oh no... action!!!
        if ((_a = request.url) === null || _a === void 0 ? void 0 : _a.endsWith(".sec")) {
            let secFile = (_b = request.url) === null || _b === void 0 ? void 0 : _b.substring(1, (_c = request.url) === null || _c === void 0 ? void 0 : _c.length);
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
            if (!fs_1.default.existsSync("./actions/" + actionData.source + ".js")) {
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
                    (0, angellib_1.ReplaceAll)((0, angellib_1.ReplaceAll)(fs_1.default.readFileSync("./svm.html") + "", "%title%", "ShinoaScript Error!"), "%content%", "<h2>Invalid Request type.</h2>"));
                response.end();
                return;
            }
            require("./actions/" + actionData.source + ".js").OnAction(response, request);
            return;
        }
        if (file.endsWith(".shinoa")) {
            try {
                let finalFile = fs_1.default.readFileSync(file) + "";
                finalFile = (0, angellib_1.ReplaceAll)(finalFile, "%shinoascript-dynamic_version%", angellib_1.ShinoaScript_VERSION);
                while (finalFile.includes("<shinoa exec=\"")) {
                    console.log("Script detected!");
                    let scriptId = finalFile.substring(finalFile.indexOf("<shinoa exec=\""));
                    scriptId = scriptId.substring(0, scriptId.indexOf("\"/>"));
                    //console.log("Script tag: " + scriptId);
                    finalFile = finalFile.replace(scriptId + "\"/>", "");
                    scriptId = scriptId.substring("<shinoa exec=\"".length);
                    console.log("executing script: " + scriptId);
                    try {
                        finalFile = yield require("./" + scriptId).main(finalFile, request, response);
                    }
                    catch (err) {
                        response.statusCode = 505;
                        response.write("" +
                            (0, angellib_1.ReplaceAll)((0, angellib_1.ReplaceAll)(fs_1.default.readFileSync("./svm.html") + "", "%title%", "ShinoaScript Error!"), "%content%", "<h2>If you are the owner, please check the server's console.</h2>"));
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
            }
            catch (err) {
                response.statusCode = 404;
                response.write("" +
                    (0, angellib_1.ReplaceAll)((0, angellib_1.ReplaceAll)(fs_1.default.readFileSync("./svm.html") + "", "%title%", "Not Found"), "%content%", "<h2>the request for \"" + request.url + "\" was not found.</h2>"));
                response.end();
                console.log("Error error!" + err);
            }
            return;
        }
        try {
            var type = mime[path_1.default.extname(file).slice(1)] || 'text/plain';
            var s = fs_1.default.createReadStream(file);
            s.on('open', function () {
                response.setHeader('Content-Type', type);
                s.pipe(response);
            });
            s.on('error', function () {
                response.statusCode = 404;
                response.write("" +
                    (0, angellib_1.ReplaceAll)((0, angellib_1.ReplaceAll)(fs_1.default.readFileSync("./svm.html") + "", "%title%", "Not Found"), "%content%", "<h2>the request for \"" + request.url + "\" was not found.</h2>"));
                response.end();
            });
        }
        catch (error) {
            response.statusCode = 505;
            response.write("" +
                (0, angellib_1.ReplaceAll)((0, angellib_1.ReplaceAll)(fs_1.default.readFileSync("./svm.html") + "", "%title%", "Internal ServerError"), "%content%", "<h2>An exception was catched. if you are the owner, please check the server's console.</h2>"));
            response.setHeader("Content-Type", "text/html");
            console.log(error);
            response.end();
        }
    });
});
let config = require("./angelprocessor.config.json");
exports.Server.listen(config.port);
console.log("Server loaded at https://localhost:" + config.port + "/");
console.log("Loaded with: " + Object.keys(config.actions).length + " Actions.");
