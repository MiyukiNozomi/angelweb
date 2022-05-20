import http from "http";

export const ShinoaScript_VERSION = "beta 0.1.2";

export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function GetDate(date : any, tzString : any = "Asia/Seoul") {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

export async function ReadRawPost(request : http.IncomingMessage) {
    const buffers = [];

    for await (const chunk of request) {
      buffers.push(chunk);
    }
  
    const data = Buffer.concat(buffers).toString();
    return data;
}

export async function ReadPostJSON(request : http.IncomingMessage) {
    const jsonData = JSON.parse(await ReadRawPost(request));
    return jsonData;
}


export function ReplaceAll(str : any, thingtoreplace : any, replacement : any) : string {
    let f = str;

    while (f.includes(thingtoreplace)) {
        f = f.replace(thingtoreplace, replacement);
    }

    return f;
}

export const ParseCookie = (str : any) => 
    str
      .split(';')
      .map((v : any) => v.split('='))
      .reduce((acc : any, v : any) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
}, {});

export function RemoveExecutable(thing : string) {
    //return thing.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return ReplaceAll(ReplaceAll(thing,"<", "&lt;"),">","&gt;");
}

import fs from "fs";

export class Database {
    public bank : any;
    public loc : any;

    public constructor(location : string) {
        this.bank = require("./dbs/" + location);
        this.loc = location;
    }

    public Save() {
        fs.writeFileSync("./dbs/" + this.loc, JSON.stringify(this.bank));
    }
}
