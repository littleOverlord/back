'use strict';
/**
 * @description Module dependencies.
 * @private 
 */

/***** Module dependencies *****/
//nodejs
const url = require("url");
const path = require("path");
//ni
const NI = require("../index");
const Log = require("../log");
const Static = require("../static");
//config
// const cfg = require("cfg.json");

/***** Module variables *****/
class Router{
    /**
     * @description 响应用户请求
     */
    static response(req, res){
        if(!matchHandler(req, res)){
            Static.response(req, res);
        }
    }
}
/**
 * @description 匹配非静态资源http(s)请求
 * @param {*} req 
 * @param {*} res 
 */
const matchHandler = (req, res) => {
    let u = url.parse(req.url),
        search = params = new url.URLSearchParams(u.search),
        funcName = search.get("@"),
        mod,
        handler;
    if(funcName){
        mod = require(NI.mergeAbs("."+u.pathname)),
        handler = mod?mod[funcName]:null;
        handler(req, res, search);
        return true;
    }
    return false;
    // else{
    //     Log.add(new Error(`No match the request of ${req.url}`),"msg");
    // }
}
/***** Module exports *****/
module.exports = Router;
/***** local running ******/
