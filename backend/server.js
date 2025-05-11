const http = require("http");
const app = require("./app");
const {initializingSocket} = require('./socket')
const port = process.env.PORT || 3000;
const server = http.createServer(app);

initializingSocket(server)

server.listen(port); 