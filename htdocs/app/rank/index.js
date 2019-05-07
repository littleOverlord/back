'use strict';
/**
 * @description Module dependencies.
 * @private 
 */
/***** Module dependencies *****/
const db = require("../../ni/db");
const log = require("../../ni/log");
const Util = require("../../ni/util");
/***** Module variables *****/

/***** Module exports *****/
exports.add = (req, res, search) => {
    console.log(search);
    let uid = Number(search.get("uid")),
        score = Number(search.get("score")),
        rank = 0,
        gte = 0,
        t = Date.now();
    // db.find("test",{},(error,data)=>{
    //     let r,c = 200;
    //     if(error){
    //         console.log(error);
    //         c = 500;
    //         r = log.clientInfo(c,error.message);
    //     }else{
    //         r = JSON.stringify(data);
    //     }
    //     Util.httpResponse(res,c,r);
    // })
    db.collection("test",(con)=>{
        con.findOne({uid},(err,result)=>{
            if(err){
                return log.clientInfo(200,err.message);
            }
            if(result){
                gte = result.score;
                rank = result.rank;
            }
            console.log(score,gte,rank)
            con.updateMany({score:{$lt:score,$gte:gte},rank:{$gt:rank}},{$inc : { "rank" : 1 }},(e,r)=>{
                console.log(e,r);
                let arr = r.ops.sort((a,b)=>{
                    return a.rank - b.rank;
                })
                if(result){
                    con.updateOne({uid},{$set:{rank:rank-arr.length,score}},(ee,rr)=>{
                        if(ee){
                            return log.clientInfo(200,ee.message);
                        }
                        log.clientInfo(200,`{"ok":${Date.now()-t}}`);
                    })
                }else{
                    con.insert({uid:uid,score,rank:arr[0].rank},(ee,rr)=>{
                        if(ee){
                            return log.clientInfo(200,ee.message);
                        }
                        log.clientInfo(200,`{"ok":${Date.now()-t}}`);
                    })
                }
            });
        })
    })
}
exports.insert = (req, res, search) => {
    let uid = 10000,
        arr = [],
        count = search.get("count"),
        t = Date.now();
    for(let i = 0;i<count; i++){
        arr.push({uid:uid+i,score:i+1,rank:i+1});
    }
    db.collection("test",(conn)=>{
        conn.insertMany(arr,(err,r)=>{
            if(err){
                return log.clientInfo(200,err.message);
            }
            Util.httpResponse(res,200,`{"ok":{"time":${Date.now()-t},"count":${count}}}`);
        })
    })
}
exports.find = (req, res, search) => {
    let uid = Number(search.get("uid")),param = {},
    t = Date.now();
    if(uid){
        param.uid = uid;
    }
    db.collection("test",(con)=>{
        con.find(param).toArray((err,result)=>{
            if(err){
                return log.clientInfo(200,err.message);
            }
            console.log(`find ${result.length} result cost ${Date.now()-t} ms!`);
            Util.httpResponse(res,200,`{"ok":${JSON.stringify(result)}}`);
            
        })
    });
}
exports.drop = (req, res, search) =>{
    let t = Date.now();
    db.collection("test",(conn)=>{
        conn.drop((err,r)=>{
            if(err){
                return log.clientInfo(200,err.message);
            }
            console.log(err,r);
            Util.httpResponse(res,200,`{"ok":{"time":${Date.now()-t}}}`);
        })
    })
}
/***** local running ******/
