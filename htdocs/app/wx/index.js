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
const Session = require("../../ni/session");
//config
const config = require("./config.json");
const WXBizDataCrypt = require('./WXBizDataCrypt')
/***** Module variables *****/
/**
 * @description 向微信服务器索取登录信息
 * @param {*} code 微信临时登录凭证 wx.login()
 * @param {*} callback 
 */
const code2Session = (code,callback) => {
    Client.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`,(error,data) => {
        
        callback(error,data);
    });
}
const addSession = (data, result, res) => {
    Session.add({
        session_wx: data.session_key,
        uid: data.openid
    });
    Util.httpResponse(res,200,`{"ok":${JSON.stringify(result)}}`);
}
/***** Module exports *****/
exports.login = (rq,res,search) => {
    const code = search.get("code"),
        encrypted = search.get("encrypted"),
        iv = search.get("iv");
    let pc;
    code2Session(code,(error,data)=>{
        if(error){
            return Util.httpResponse(res,500,log.clientInfo(500,error.message));
        }
        data = JSON.parse(data);
        if(data.errcode){
            return Util.httpResponse(res,500,log.clientInfo(500,data.errmsg));
        }
        // console.log(encrypted,iv);
        pc = new WXBizDataCrypt(config.appId, data.session_key);
        data = pc.decryptData(encrypted , iv);
        db.findOne("user",{uid:data.openId},(err,result)=>{
            if(err){
                return Util.httpResponse(res,500,log.clientInfo(500,err.message));
            }
            if(!result){
                return db.insertOne("user",{uid:data.openId,from:"wx",name:data.nickName,head:data.avatarUrl,info:data},(e,r)=>{
                    if(e){
                        return Util.httpResponse(res,500,log.clientInfo(500,e.message));
                    }
                    addSession(data,r,res);
                })
            }
            addSession(data,result,res);
        })
    })
}
/***** local running ******/
