'use strict';
/**
 * @description Module dependencies.
 * @private 
 */

/***** Module dependencies *****/
//node modules
const fs = require('fs');

//private modules
const NI = require('../index');
const util = require("../util");
//config

/***** Module variables *****/
let root;
/**
 * @description error wait table
 */
let wait=[];

/**
 * @description log
 * @param {String}type log type (will be suffix of the log file) : "error","warn","info"...
 * @param {String}title the log message's title
 * @param {String}msg detail of the log
 */
const Log = (type,msg) => {
    let _d = new Date();
    return {
        date: _d.toString(),
        name: `${_d.getFullYear()}-${_d.getMonth()}-${_d.getDate()}`,
        type: type,
        msg: msg
    };
}

/**
 * @description write next
 */
const writeNext = (err) => {
    wait.shift();
    wait.length && _write(wait[0]);
    if(err)
        throw err;
};

/**
 * @description write log
 */
const _write = (data) => {
    let _n = `${root}/${data.name}.${data.type}`,
        _err = `========================\r\n${data.date}\r\n`;
    fs.appendFile(_n,`${_err}${data.msg}\r\n`,writeNext);
}
/**
 * @description add log
 * @param {string} type log type like : "error"..
 * @param {Error} err 
 */
const add = (type,err) => {
    wait.push(Log(type,err.stack));
    if(wait.length == 1)
        _write(wait[0]);
}

/***** Module exports *****/
/**
 * @description set global error listener
 * @param {String}path log directory's path 
 * @example (1,"common/util.js") return "common/"
 */
exports.init = (cfg) => {
    root = NI.mergeAbs(cfg.log.dir);
    //try to create the log dir, ignore error
    util.tryCatch(()=>{
        fs.mkdirSync(root);
    });
    
    process.on('uncaughtException', (err) => {
        add("error",err);
    });
    console.log(`log init ok !! dir = ${root}`);
};
/**
 * @description add log interface
 */
exports.add = (err,type) => {
    add(type||"error",err);
}
/**
 * @description 创建往前台发送的错误消息
 */
exports.clientInfo = (code,msg) => {
    return `{"err":{"reson":"${msg}","code":${code}}}`;
}
/***** local running ******/
