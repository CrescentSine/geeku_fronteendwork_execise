let connect = require("connect");
let vite = require("vite");

let createVite = vite.createServer({
    server: {
        middlewareMode: "html"
    }
});

let server = connect();

server.use("/api", function (req, resp) {

});

createVite.then(function (viteInst) {
    server.use(viteInst.middlewares);

    server.listen(3000);
});