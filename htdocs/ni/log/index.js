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
const cfg = require('./cfg.json');

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
/**
 * @description set global error listener
 * @param {String}path log directory's path 
 * @example (1,"common/util.js") return "common/"
 */
init = () => {
    root = NI.mergeAbs(cfg.dir);
    console.log(root);
    //try to create the log dir, ignore error
    util.tryCatch(()=>{
        fs.mkdirSync(root);
    },true);
    
    process.on('uncaughtException', (err) => {
        add("error",err);
    });
};
/***** Module exports *****/
/**
 * @description add log interface
 */
exports.add = (err,type) => {
    add(type||"error",err);
}
/***** local running ******/

init();