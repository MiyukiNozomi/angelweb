# AngelWeb Processor

this is pretty much a ripoff php with some changes.
i still need to write a documentation, but the thing itself is pretty much
self-explanatory.

# Preprocessing web pages.

so, this thing features the hability to run scripts before web pages are 
sent to web browsers, and it allows you to modify the string content
of a webpage, like in this example:

index.shinoa
```html
<html>
    <!-- important to mention that i do not parse the html -->
    <shinoa exec="scripts/sample.shinoa"/>
    <!-- so make sure to write it exacly in this format without additional spaces.-->
    <body>   
        <!-- thing to be replaced by ReplaceAll-->
        %shinoascript-msg%
    </body>
</html>
```

scripts/sample.shinoa.ts
```ts
import { IncomingMessage, ServerResponse } from "http";
import {ReplaceAll} from "./../angellib";

export function main(file : string, request : IncomingMessage, response : ServerResponse) {
    return file.ReplaceAll("%shinoascript-msg%","Hello! if you see this, it means its working!");
}
```

Pretty simple huh?

# Custom Server Actions
so, this is something that php doesn't has, but its cool:
this project allows you to script actions for example:
when the browser requests for /msg.sec reply with "Hello!"
or do something else like receive a JSON and save it somewhere.

first, they need to be defined in the configuration file like this: 
```json
{
    "port": 5040,
    "actions": {
        "test.sec": {
            "method": "GET",
            "source": "test.shinoa"
        }
    }
}
```
the 'method' key isn't required, but if it is present the server
will only run the action if the browser request matches that defined
in the config file.

the 'source' key is the one that references the source file in the actions folder in which
the OnAction method is located.

in this example, accessing test.sec will result in the message 'Hello!'

actions/test.shinoa.ts
```ts
import { IncomingMessage, ServerResponse } from "http";

export function OnAction(response : ServerResponse, request : IncomingMessage) {
    response.writeHead(200);
    response.write("Hello!");
    response.end();
}
```

# JSON Databases
yeah yeah i know using json for databases isn't that good of an idea, 
but if you want this project has a built-in class to do that.

# TODOs
* write an actual documentation
* add an actual html parser for shinoa tags
* add more functionalities for the shinoa tag
* add support for SQL