let connect = require("connect");
let vite = require("vite");

let createVite = vite.createServer({
    server: {
        middlewareMode: "html"
    }
});

let server = connect();

server.use("/api", function (req, resp) {
    console.log("req url:", req.url);
    resp.statusCode = 404;
    resp.end("The specified API is not implemented.");
});

createVite.then(function (viteInst) {
    server.use(viteInst.middlewares);

    server.listen(3000);
});