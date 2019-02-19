/**
 * @description http && https server Module.
 * @private 
 */
/***** Module dependencies *****/
//nodejs
const fs = require("fs");
const http = require("http");
const https = require("https");
//ni
const router = require("../router");
//config
const cfg = require("./cfg.json");


/***** Module variables *****/
/**
 * @description 启动服务
 */
class Start{
    static http(_cfg){
        const server = http.createServer((req, res) => {
            console.log(req.url);
            router.response(req, res);
        });
        server.on('clientError', (err, socket) => {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        server.listen(_cfg.port);
        console.log(`http server start at port ${_cfg.port}`)
          
    }
    static https(_cfg){

    }
}

/***** Module exports *****/
/**
 * @description 启动http(s)服务器
 */
exports.serverStart  = (callback) => {
    for(let k in cfg){
        Start[k] && Start[k](cfg[k]);
    }
}

/***** local running ******/
