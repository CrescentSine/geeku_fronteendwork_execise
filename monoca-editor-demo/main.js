const connect = require("connect");
const md5 = require("md5");
const vite = require("vite");
const fs = require("fs");

/**
 * @typedef {typeof import('http')} http
 * @typedef {InstanceType<http['ServerResponse']>} ServerResponse
 * @typedef {typeof import('stream')} stream
 * @typedef {InstanceType<stream['Readable']>} Readable
 * */

let createVite = vite.createServer({
    server: {
        middlewareMode: "html"
    }
});

let server = connect();

/**
 * @param {Readable} stream
 * @returns {Promise<string>}
 * */
function readStringFromStream(stream) {
    return new Promise(function (resolve, reject) {
        /** @type {Buffer[]} */
        let received = [];
        stream.on("data", chunk => received.push(chunk));
        stream.on("error", err => reject(err));
        stream.on("end", () => resolve(Buffer.concat(received).toString("utf-8")));
    })
}

/** @type {Record<string, (args: Record<string,string>, req: connect.IncomingMessage, resp: ServerResponse)=>void|Promise<void>} */
const apiRouter = {
    "/preview": async function (_, req, resp) {
        try {
            let postedFile = await readStringFromStream(req);
            let fileMd5 = md5(postedFile);

            await new Promise(function (resolve, reject) {
                fs.writeFile(`./src/${fileMd5}.vue`, postedFile,
                    err => err ? reject(err) : resolve());
            });

            resp.end(fileMd5);
        }
        catch (err) {
            resp.statusCode = 500
            resp.end(err.message);
        }
    },
}

server.use("/api", function (req, resp) {
    console.log("req api url:", req.url);
    let [api, args] = req.url.split('?');
    /** @type {Record<string, string>} */
    let argObj = {}
    if (args) {
        for (let pair of args.split('&')) {
            let [key, value] = pair.split('=');
            argObj[key] = value;
        }
    }
    if (apiRouter[api]) {
        apiRouter[api](argObj, req, resp);
    }
    else {
        resp.statusCode = 404;
        resp.end("The specified API is not implemented.");
    }
});

createVite.then(function (viteInst) {
    server.use(viteInst.middlewares);

    server.listen(3000);
});