﻿'use strict';
/**
 * @description static res Module.
 * @private 
 */
/***** Module dependencies *****/
//node modules
const fs = require("fs");
const url = require("url");
const path = require("path");
const zlib = require('zlib');
//ni
const NI = require("../index");
const log = require("../log");
//config
const mime = require("./mime.json");

/***** Module variables *****/
class Static{
    /**
     * @description 静态资源响应
     * @param {*} req 
     * @param {*} res 
     */
    static response(req, res){
        let u = parseUrl(req.url),
            data = Static.caches.get(path.normalize(u.pathname));
        // console.log(req.url);
        // console.log(req.headers);
        // if(data !== undefined){
        //     setTimeout(()=>{
        //         response(data, req, res, u);
        //     },0);
        // }else{
            readFile(u.pathname,(err,_data)=>{
                // if(err){
                //     console.log(err);
                //     console.log(_data);
                // }
                response(_data, req, res, u);
            })
        // }
    }
    static init(cfg){
        Static.config = cfg.static;
        Static.root = NI.mergeAbs(cfg.static.dir);
        //读取文件，缓存，同时添加文件监听
        readDir("");
        //设置文件更新循环
        runWait();
        console.log("static res is ok!!");
    }
}
//配置
Static.config;
//静态资源根目录
Static.root;
//静态资源缓存表
Static.caches = new Map();
//监听缓存
Static.watcher = {};
//目录缓存
Static.dirCache = {};
//修改缓存
Static.waitRead = [];
/**
 * @description 解析url
 */
const parseUrl = (u) => {
    u = (u === "/" && Static.config.default)?Static.config.default:u;
    return url.parse(u);
}
/**
 * @description 资源响应
 * @param {*} data 
 * @param {*} res 
 * @param {*} u 
 */
const response = (data, req, res, u) => {
    let ext=path.extname(u.pathname),
        acceptEncoding = req.headers["accept-encoding"],
        header = {"Content-Type":req.headers["content-type"] || mime[ext]||"text/plain","Access-Control-Allow-Origin": "*"},
        output,
        code = 200,
        resWrite = (r) => {
            // console.log(Buffer.isBuffer(r));
            header["Content-Length"] = Buffer.byteLength(r);
            res.writeHead(code, header);
            res.end(r,"binary");
            // console.log(header);
        };
    if(data === undefined){
        code = 404;
        header["Content-Type"] = "text/plain";
        data = log.clientInfo(400,`Not found ${u.pathname}`);
    }
    // console.log("response");
    // console.log(Static.caches.keys());
    // console.log(code,contenttype,data.toString("utf8"));
    // console.log(Buffer.isBuffer(data));
    if (acceptEncoding && acceptEncoding.indexOf("deflate")===0) {
        header['Content-Encoding'] = 'deflate';
        output = zlib.deflate;
      } else if (acceptEncoding && acceptEncoding.indexOf("gzip")===0) {
        header['Content-Encoding'] ='gzip';
        output = zlib.gzip;
      } else {
        resWrite(data);
      }
    if(output){
        output(data,(err,r)=>{
            // console.log(`gzip ${u.pathname} is ${1 - Buffer.byteLength(r)/Buffer.byteLength(data)}`);
            if(err){
                console.log(err);
                return resWrite(data);
            }
            resWrite(r);
        })
    }
    // output.end();
    // console.log(u.pathname);
}

//读取文件夹,创建目标文件夹
const readDir = (dir) => {
    let ap = path.join(Static.root,dir),
        files = fs.readdirSync(ap,"utf8"),
        p,fp;
    addWatch(ap);
    Static.dirCache[ap] = files;
    for(let i = 0, len = files.length; i < len; i++){
        p = `${dir}${path.sep}${files[i]}`;
        fp = path.join(Static.root,p);
        if(isDir(fp)){
            readDir(p); 
        }else{
            readFileSync(p);
        }
    }
}
/**
 * @description 异步读取文件
 * @param {*} p 
 * @param {*} callback 
 */
const readFile = (p,callback) => {
    let ap = path.join(Static.root,p);
    // console.log("readfile ", p, ap);
    fs.readFile(ap,(err, data)=>{
        if(err){
            return callback(err,data);
        }
        Static.caches.set(p,data);
        // console.log("readFile");
        // console.log(Static.caches.keys());
        callback(err,data);
    });
    
}
//同步读取文件
const readFileSync = (p) => {
    let ap = path.join(Static.root,p),
        data = fs.readFileSync(ap);
    // console.log(ap,typeof data,Buffer.isBuffer(data))
    Static.caches.set(p,data);
}
//判断是否文件夹
const isDir = (p) => {
    let stat = fs.lstatSync(p);
    return stat.isDirectory();
}
const watchHandler = (dir) => {
    return (eventType, filename) => {
        let p = path.join(dir,filename),
            file = path.normalize(p.replace(Static.root,"")),
            prev,
            index,
            isdir;
        // console.log(eventType,p,file);
        isdir = (eventType == "rename" && Static.caches.get(file) === undefined && Static.dirCache[p]===undefined)?isDir(p):Static.dirCache[p] !== undefined;
        //判断是否文件
        if(isdir && eventType == "change"){
            return;
        }
        //新建文件夹
        if(isdir && Static.dirCache[p] == undefined){
            Static.dirCache[dir].push(filename);
            return readDir(p.replace(Static.root,""));
        }
        if(eventType == "rename"){
            
            if(Static.caches.get(file)!== undefined){
                Static.caches.delete(file);
                index = Static.dirCache[dir].indexOf(filename);
                if(index >= 0){
                    Static.dirCache[dir].splice(index,1);
                }
                // console.log("delete dir file",dir,filename,index);
            }else if(isdir){
                prev = p.replace(file,"");
                index = Static.dirCache[prev].indexOf(filename);
                if(index >= 0){
                    Static.dirCache[prev].splice(index,1);
                }
                // console.log("delete dir file",prev,filename,index);
                clearDir(p);
            }else if(Static.dirCache[dir]!==undefined && Static.dirCache[dir].indexOf(filename) < 0){
                Static.dirCache[dir].push(filename);
            }
        }
        // console.log(Static.dirCache);
        // console.log(Static.caches);
        // console.log(Static.watcher);
        // _this.addTask(type,p.replace(_this.root,""));
        addWait(p.replace(Static.root,""))
    }
}
//添加文件夹监听
const addWatch = (dir) => {
    // console.log("add watch ",dir);
    Static.watcher[dir] = fs.watch(dir, { encoding: 'utf8' }, watchHandler(dir));
}
//添加文件更新等待列表
const addWait = (p) => {
    if(Static.waitRead.indexOf(p) >= 0){
        return;
    }
    Static.waitRead.push(p);
}
//执行文件更新循环
const runWait = () => {
    for(let i = Static.waitRead.length - 1;i >= 0; i--){
        readFile(Static.waitRead[i],()=>{});
    }
    Static.waitRead = [];
    setTimeout(runWait,100);
}
//删除文件夹
const clearDir = (dir) => {
    let files = Static.dirCache[dir],p,file;
    if(Static.watcher[dir]){
        Static.watcher[dir].close();
        delete Static.watcher[dir];
    }
    delete Static.dirCache[dir];
    
    for(let i = 0,len = files.length;i < len; i++){
        p = path.join(dir,files[i]);
        file = path.normalize(p.replace(Static.root,""));
        // console.log(p,file,typeof Static.caches.get(file));
        if(Static.dirCache[dir]){
            clearDir(p);
        }else if(Static.caches.get(file) !== undefined){
            Static.caches.delete(file);
            console.log("delete",file);
        }
    }
    // console.log(Static.caches.size);
}
/***** Module exports *****/
module.exports = Static;
/***** local running ******/
