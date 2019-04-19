'use strict';
/**
 * @description app start module.
 * @private 
 */
/***** Module dependencies *****/
//node
var crypto = require('crypto');
//ni
const db = require("../../ni/db");
const log = require("../../ni/log");
const Util = require("../../ni/util");
const Session = require("../../ni/session");
//config
/***** Module variables *****/
const ERR = {
    "ap": "Incorrect account or password",
    "ia": "Invalid account",
    "ra": "Repeat account"
}
/**
 * @description 添加session
 * @param {*} data 
 * @param {*} result 
 * @param {*} res 
 */
const addSession = (result, res) => {
    let s = Session.add({
        uid: result.uid
    });
    Util.httpResponse(res,200,`{"":${s.sessionKey},"ok":{"uid":${result.uid},"username":${result.username},"from":${result.from||""}}}`);
}
/**
 * @description 获取最新uid
 * @param {*} res 
 * @param {*} callback 
 */
const getUid = (callback) => {
    db.findOne("global",{key:"uid"},(err,result)=>{
        if(err){
            return callback(err,result);
        }
        if(!result){
            db.insertOne("global",{key:"uid",value:10000},(e, r) => {
                callback(e,r);
            })
        }
        db.updateOne("global",{key:"uid"},{value: result.value + 1},(e, r) => {
            callback(e,r);
        })
    });
}
/**
 * @description 检查用户输入密码是否正确
 */
const checkUser = (password, local) => {
    let sha = sha512(password,local.salt);
    return sha === local.password;
}
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};
/***** Module exports *****/
/**
 * @description 用户登录
 * @param search 前台传的参数 {name: "",psw: ""}
 */
exports.login = (rq,res,search) => {
    const userName = search.get("name"),
        password = search.get("psw");
    db.findOne("user",{username:userName},(err,result)=>{
        if(err){
            return Util.httpResponse(res,500,log.clientInfo(500,err.message));
        }
        if(result){
            if(checkUser(password,result)){
                return addSession(result,res);
            }
        }
        Util.httpResponse(res,500,log.clientInfo(500,ERR.ap));
    });
}
/**
 * @description 用户注册
 * @param search 前台传的参数 {name: "", psw: "", from: ""}
 */
exports.regist = (rq,res,search) => {
    const username = search.get("name"),
        password = search.get("psw"),
        from = search.get("from"),
        salt;
    db.findOne("user",{username},(err,result)=>{
        if(err){
            return Util.httpResponse(res,500,log.clientInfo(500,err.message));
        }
        if(result){
            Util.httpResponse(res,500,log.clientInfo(500,ERR.ra));
        }
        getUid((e,r)=>{
            if(e){
                return Util.httpResponse(res,500,log.clientInfo(500,e.message));
            }
            salt = genRandomString(32);
            password = sha512(password,salt);
            db.insertOne("user",{username,password,salt,from},(er,rr)=>{
                if(er){
                    return Util.httpResponse(res,500,log.clientInfo(500,er.message));
                }
                addSession(rr,res);
            })
        })
    });
}
/***** local running ******/
