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
/**
 * @description 添加session
 * @param { JSON } data 微信解密数据
 * @param { JSON } result 数据库存储的数据
 * @param { Response } res 
 */
const addSession = (data, result, res) => {
    let s = Session.add({
        session_wx: data.session_key,
        uid: data.openid
    });
    Util.httpResponse(res,200,`{"":${s.sessionKey},"ok":${JSON.stringify(result)}}`);
}
/**
 * @description 查找用户
 * @param {Response} res 
 * @param {Json} data 微信用户解密数据
 * @param {Function} notCallback 不存在该uid的用户回调
 */
const findUser = (res, data, notCallback) => {
    db.findOne("user",{uid:data.openid},(err,result)=>{
        if(err){
            return Util.httpResponse(res,500,log.clientInfo(500,err.message));
        }
        if(result){
            addSession(data,result,res);
        }else{
            notCallback();
        }
    });
}
/***** Module exports *****/
/**
 * @description 微信用户登录
 * @param search 前台传的参数 由用户通过微信前台接口调用获取 {code: "微信登录临时code",encrypted: "微信用户加密数据", iv: "解密算法初始向量"}
 *              https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/login.html
 */
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
        findUser(res,data,()=>{
            // console.log(encrypted,iv);
            pc = new WXBizDataCrypt(config.appId, data.session_key);
            let _data = pc.decryptData(encrypted , iv);
            db.insertOne("user",{uid:_data.openId,from:"wx",name:_data.nickName,head:_data.avatarUrl,info:_data},(e,r)=>{
                if(e){
                    return Util.httpResponse(res,500,log.clientInfo(500,e.message));
                }
                addSession(data,r,res);
            })
        })
    })
}
/***** local running ******/
