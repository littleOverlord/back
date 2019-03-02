'use strict';
/**
 * @description Module dependencies.
 * @private 
 */
/***** Module dependencies *****/
const db = require("../../ni/db");
const log = require("../../ni/log");
/***** Module variables *****/

/***** Module exports *****/
exports.test = (req, res, search) => {
    console.log(search);
    db.find("test",{},(error,data)=>{
        let r,c = 200;
        if(error){
            console.log(error);
            c = 500;
            r = log.clientInfo(c,error.message);
        }else{
            r = JSON.stringify(data);
        }
        res.writeHead(c,{"content-type":"text/plain"});
        res.write(r);
        res.end();
    })
    
}
exports.delete = (req, res, search) => {
    const id = search.get("_id");
    db.deleteOne("test",{_id: new db.ObjectID(id)},(error,data)=>{
        let r,c = 200;
        if(error){
            console.log(error);
            c = 500;
            r = log.clientInfo(c,error.message);
        }else{
            r = JSON.stringify(data.result);
        }
        console.log(data);
        res.writeHead(c,{"content-type":"text/plain"});
        res.write(r);
        res.end();
    })
}
exports.performance = (req, res, search) => {
    let t = Date.now(),c = search.get("count"),d=0,
        fn = search.get("method"),
        ms = ["insertOne","find","deleteOne"],
        func = () => {
            if(fn){
                return fn;
            }
            let rd = Math.random();
            if(rd < 1/3){
                return ms[0];
            }else if(rd >= 1/3 && rd < 2/3){
                return ms[1];
            }else{
                return ms[2];
            }
        };
    for(let i = c;i>0;i--){
        db[func()]("test",{value:i},(err,data)=>{
            if(err){
            console.log(err);
            }
            d += 1;
            if(c == d){
            console.log(`test ${fn || "db"} count ${c} cost time: ${Date.now() - t} ms`);
            }
        })
    }
    res.writeHead(200,{"content-type":"text/plain"});
    res.write("ok");
    res.end();
  }
/***** local running ******/
