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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveExecutable = exports.ParseCookie = exports.ReplaceAll = exports.ReadPostJSON = exports.ReadRawPost = exports.GetDate = exports.Months = exports.ShinoaScript_VERSION = void 0;
exports.ShinoaScript_VERSION = "beta 0.1.2";
exports.Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function GetDate(date, tzString = "Asia/Seoul") {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}
exports.GetDate = GetDate;
function ReadRawPost(request) {
    var request_1, request_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const buffers = [];
        try {
            for (request_1 = __asyncValues(request); request_1_1 = yield request_1.next(), !request_1_1.done;) {
                const chunk = request_1_1.value;
                buffers.push(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (request_1_1 && !request_1_1.done && (_a = request_1.return)) yield _a.call(request_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const data = Buffer.concat(buffers).toString();
        return data;
    });
}
exports.ReadRawPost = ReadRawPost;
function ReadPostJSON(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonData = JSON.parse(yield ReadRawPost(request));
        return jsonData;
    });
}
exports.ReadPostJSON = ReadPostJSON;
function ReplaceAll(str, thingtoreplace, replacement) {
    let f = str;
    while (f.includes(thingtoreplace)) {
        f = f.replace(thingtoreplace, replacement);
    }
    return f;
}
exports.ReplaceAll = ReplaceAll;
const ParseCookie = (str) => str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
}, {});
exports.ParseCookie = ParseCookie;
function RemoveExecutable(thing) {
    //return thing.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return ReplaceAll(ReplaceAll(thing, "<", "&lt;"), ">", "&gt;");
}
exports.RemoveExecutable = RemoveExecutable;
