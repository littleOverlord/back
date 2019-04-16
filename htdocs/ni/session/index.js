'use strict';
/**
 * @description util Module.
 * @private 
 */
/***** Module dependencies *****/
//node js
const crypto = require("crypto");
//ni
const log = require("../log");
const Util = require("../util");
/***** Module variables *****/
/**
 * @description 每个session持续时间
 */
const LASTTIME = 1000 * 300;
/**
 * @description session 列表
 * @item 
 */
const table = {}
/**
 * @description uid映射表
 */
const uidMap = {}
/**
 * @description session 缓存表 上限2000
 */
const caches = [];
/**
 * @description Session类
 */
class Session{
    constructor(options){
        this.fresh(options);
    }
    /**
     * @description session 唯一标识
     */
    // sessionKey = ""
    /**
     * @description session过期时间,过期后需要前台用户重登录才能更新
     */
    // expire = Date.now() + LASTTIME
    /**
     * @description 用户id
     */
    // uid = ""
    /**
     * @description 微信的会话密钥
     */
    // session_wx = ""
    /**
     * @description 刷新成新的session
     */
    fresh(options){
        for(let k in options){
            this[k] = options[k];
        }
        if(!this.sessionKey){
            this.sessionKey = md5((Date.now()).toString()+this.uid.toString());
        }
        this.expire = Date.now() + LASTTIME;
    }
    /**
     * @description 更新session
     */
    update(){
        this.expire = Date.now() + LASTTIME;
    }
}
/**
 * @description 创建session,先从缓存中取
 */
const create = (options) => {
    let ss = caches.pop();
    if(!ss){
        ss = new Session(options);
    }else{
        ss.fresh(options);
    }
    return ss;
}
/**
 * @description 检查session时间是否过期
 */
const checkTime = (s) => {
    if(Date.now() >= s.expire){
        s.update();
        return true;
    }
    return false;
}
/**
 * @description 添加缓存
 */
const addCache = (s) => {
    if(caches.length < 2000){
        caches.push(s);
    }
}
/**
 * @description 循环检查session是否过期
 */
const loop = () => {
    for(let k in table){
        if(Date.now() >= table[k].expire){
            addCache(table[k]);
            delete table[k];
            delete uidMap[table[k].uid];
        }
    }
    setTimeout(loop,LASTTIME/2);
}
/**
 * @description md5加密
 * @param {string} content  加密的明文；
 */
const md5 = (content) => {
    var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆
    md5.update(content);
    return md5.digest('hex');  //加密后的值d
}
/***** Module exports *****/

/**
 * @description 导出Session类
 */
exports.Session = Session;
/**
 * @description 添加session
 * @param {*} sessionKey session唯一id
 * @param {*} options session状态
 */
exports.add = (options) => {
    let ss = create(options);
    table[ss.sessionKey] = ss;
    uidMap[ss.uid] = ss;
    return ss;
}
/**
 * @description 检查session是否有效
 */
exports.check = (options) => {
    let ss = table[options.sessionKey];

    return !!ss && checkTime(ss);
}
/***** local running ******/
/**
 * @description 开始session检查循环
 */
loop();