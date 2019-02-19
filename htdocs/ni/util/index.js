/**
 * @description util Module.
 * @private 
 */
/***** Module dependencies *****/
//ni
const log = require("../util");
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
exports.tryCatch = (callback,dontLog) => {
    try{
        callback();
    }catch(e){
        if(!dontLog){
            log.add("error",e);
        }
    }
}
/***** local running ******/
