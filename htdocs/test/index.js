'use strict';
/**
 * @description app start module.
 * @private 
 */
/***** Module dependencies *****/
//node

//ni
const Util = require("../ni/util");
const log = require("../ni/log");
const db = require("../ni/db");
//config
/***** Module variables *****/
const handlers = {
    /**
     * @description test db find and insert
     */
    findAndInsert: (rq,res,search)=>{
        db.findOne("test",{uid:1},(err,result)=>{
            if(err){
                return Util.httpResponse(res,500,log.clientInfo(500,err.message));
            }
            if(!result){
                return db.insertOne("test",{uid:1,time:Date.now()},(e,r)=>{
                    if(e){
                        return Util.httpResponse(res,500,log.clientInfo(500,e.message));
                    }
                    Util.httpResponse(res,200,JSON.stringify(r));
                })
            }
            Util.httpResponse(res,200,JSON.stringify(result));
        })
    }
}
/***** Module exports *****/
exports.run = (rq,res,search)=> {
    let func = search.get("func");
    if(rq.headers.host.indexOf("xianquyouxi") >= 0){
        return Util.httpResponse(res,500,log.clientInfo(500,"request error"));
    }
    console.log();
    console.log(func);
    handlers[func] && handlers[func](rq,res,search);
}
/***** local running ******/
