'use strict';
/**
 * @description db Module.
 * @private 
 */
/***** Module dependencies *****/
//third party

//ni
const log = require("../log");
const Util = require("../util");
/***** Module variables *****/
const handlerTable = {};
const runHandlers = (type) => {
  let list = handlerTable[type];
  if(!list){
    return;
  }
  for(let i = 0, len = list.length; i < len; i++){
    Util.tryCatch(()=>{
      list[i] && list[i]();
    },(error)=>{
      log.add(error,"error");
    })
  }
  
}
/***** Module exports *****/
/**
 * @description 设置进程监控类型
 * @param {string} type "shutDown"
 */
exports.addHandle = (type,handler) => {
  let list = handlerTable[type];
  if(!list){
    handlerTable[type] = list = [];
  }
  if(list.indexOf(handler) >= 0){
    return;
  }
  list.push(handler);
}
/***** local running ******/
//监听进程退出，关闭数据库连接
process.on('SIGINT', (code) => {
  runHandlers("shutDown");
  console.log(`exit code ${code}`);
  process.exit(0);
});
//监听未捕获的异常
process.on('uncaughtException', (err) => {
  log.add(err,"error");
});