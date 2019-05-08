'use strict';
/**
 * @description project global module.
 * @private 
 */
/***** Module dependencies *****/
//nodejs
const path = require("path");
const fs = require("fs");

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
    /**
     * @description 初始化某个路径下的模块，必须以文件夹作为模块单位，数据库建立连接之后调用
     * @param { string } dir  NI.absPath下的目录 like: "app"||"ni"
     */
    static initMod(dir){
        let dis = `${NI.absPath}${dir}`,
            ds = fs.readdirSync(dis),
            md,
            mod;
        for(let i = 0, len = ds.length; i < len; i++){
            md = `${dis}/${ds[i]}`;
            if(fs.lstatSync(md).isDirectory()){
                mod = require(md);
                if(mod && mod.init){
                    mod.init();
                }
            }
        }
    }
}
//项目绝对路径 .../htdocs/
NI.absPath = process.cwd().replace("app","");
/***** Module exports *****/
module.exports = NI;
/***** local running ******/
