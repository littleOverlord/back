'use strict';
/**
 * @description app start module.
 * @private 
 */
/***** Module dependencies *****/
//node

//ni
const Client = require("../../ni/client");
const db = require("../../ni/db");
const log = require("../../ni/log");
const Util = require("../../ni/util");
//config
const config = require("./cfg.json");
/***** Module variables *****/
/**
 * @description 向微信服务器索取登录信息
 * @param {*} code 微信临时登录凭证 wx.login()
 * @param {*} callback 
 */
const code2Session = (code,callback) => {
    Client.httpGet(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`,(error,data) => {
        callback(error,data);
    });
}
/***** Module exports *****/
exports.login = (rq,res,serch) => {
    const code = serch.get("code");
    code2Session(code,(error,data)=>{
        if(error){
            return Util.httpResponse(res,200,log.clientInfo(200,error.message));
        }
        data = JSON.parse(data);
    })
}
/***** local running ******/
