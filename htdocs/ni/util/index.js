'use strict';
/**
 * @description util Module.
 * @private 
 */
/***** Module dependencies *****/
//ni
/***** Module variables *****/
/***** Module exports *****/
/**
 * @description 满足一定调用次数之后才运行回调函数
 */
exports.countCall = (count,callback) => {
    let func = (param) => {
        this.count -= 1;
        if(this.count == 0){
            callback && callback(param);
            this.count = this.count = count = callback = undefined;
        }
    };
    func.count = count;
    return func;
}
/**
 * @description 异常捕获
 */
exports.tryCatch = (callback,errorBack) => {
    try{
        callback();
    }catch(e){
        errorBack && errorBack(e);
    }
}
/**
 * @description 响应http
 * @param res http.
 */
exports.httpResponse = (res,code,data,contentType) => {
    res.writeHead(code,{"content-type":contentType||"text/plain"});
    res.write(data);
    res.end();
}
/**
 * @description 获取新的uid
 */
exports.getUid = (db,gamename,callback) => {
    db.collection("userid",(con)=>{
        con.findOneAndUpdate({gamename},{$set:{gamename}, $inc : { "uid" : 1 }},{upsert:true, returnNewDocument : true},(err,result)=>{
            // console.log(err,result);
            let value = err?null:result.value;
            if(!err && !value){
                value = {gamename,uid:1};
            }
            callback(err,value);
        })
    })
}
/***** local running ******/
