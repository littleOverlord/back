const crypto = require("crypto");
/**
 * @description 获取http post data
 */
exports.getPostData = function (ctx) {
    return new Promise((resolve, reject) => {
        try {
            let str = ''
            ctx.req.on('data', (chunk) => {
                str += chunk
            })
            ctx.req.on('end', (chunk) => {
                resolve(str)
            })
        }catch(err){
            reject(err)
        }
    });
}
/**
 * @description 合并服务器响应
 */
exports.mergeResponse = (ctx,param)=>{
    ctx.response.status = 200;
    ctx.body = param;
}
/**
 * @description 字符串md5加密
 */
exports.str2Md5 = (str) => {
    var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    md5.update(str);
    var d = md5.digest('hex');  //加密后的值d
    return d;
}