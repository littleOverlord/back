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
/***** local running ******/
