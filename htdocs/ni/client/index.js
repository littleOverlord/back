'use strict';
/**
 * @description util Module.
 * @private 
 */
/***** Module dependencies *****/
//node js
const url = require("url");
//ni
const log = require("../log");
const Util = require("../util");
/***** Module variables *****/
class Client{
    /**
     * @description 客户端get请求
     * @param {string} url 请求链接
     * @param {Function} callback (error,data)=>{} 请求回调
     */
    static get(_url, callback){
        let pu = url.parse(_url),
            mn = pu.protocol.replace(":",""),
            mod = require(mn);

        mod.get(_url,(res) => {
            const { statusCode } = res;
          
            let error,rawData = '';
            if (statusCode !== 200) {
              error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            }
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                res.resume();
                Util.tryCatch(()=>{
                    callback(error);
                },(e)=>{
                    log.add(e,"error");
                });
              return;
            }
          
            res.setEncoding('utf8');
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                Util.tryCatch(()=>{
                    callback(error,rawData);
                },(e)=>{
                    log.add(e,"error");
                });
            });
          }).on('error', (e) => {
            Util.tryCatch(()=>{
                callback(e);
            },(e)=>{
                log.add(e,"error");
            });
            console.error(`Got error: ${e.message}`);
          });
    }
}
/***** Module exports *****/

/**
 * @description 异常捕获
 */
module.exports = Client;
/***** local running ******/
