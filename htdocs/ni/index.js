'use strict';
/**
 * @description project global module.
 * @private 
 */
/***** Module dependencies *****/
//nodejs
const path = require("path");

/***** Module variables *****/
class NI{
    /**
     * @description 获取绝对路径
     * @param rPath 相对路径
     */
    static mergeAbs(rPath){
        // console.log(NI.absPath,rPath);
        return path.resolve(NI.absPath,rPath);
    }
}
//项目绝对路径 .../htdocs/
NI.absPath = process.cwd().replace("app","");
/***** Module exports *****/
module.exports = NI;
/***** local running ******/
