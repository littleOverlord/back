'use strict';
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
const Util = require("../util");
const router = require("../router");
const log = require("../log");
//config


/***** Module variables *****/
/**
 * @description 启动服务
 */
class Start{
    static http(_cfg){
        const server = http.createServer((req, res) => {
            Util.tryCatch(()=>{
                router.response(req, res);
            },(error) => {
                res.writeHead(500,{"content-type":"text/plain"});
                res.write(log.clientInfo(500,error.message));
                res.end();
                log.add(error,"error");
            });
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
exports.serverStart  = (cfg) => {
    for(let k in cfg.server){
        Start[k] && Start[k](cfg.server[k]);
    }
}

/***** local running ******/
