'use strict';
/**
 * @description util Module.
 * @private 
 */
/***** Module dependencies *****/
//node js
const http = require("http");
//ni
const log = require("../log");
const Util = require("../util");
/***** Module variables *****/
class Session{
    static table = {}
    /**
     * @description 添加session
     * @param {*} sessionKey session唯一id
     * @param {*} options session状态
     */
    static add(sessionKey,options){
        Session[sessionKey] = options;
    }
}
/***** Module exports *****/

/**
 * @description 异常捕获
 */
module.exports = Session;
/***** local running ******/
