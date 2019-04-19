'use strict';
/**
 * @description db Module.
 * @private 
 */
/***** Module dependencies *****/
//third party
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;//用自增长_id去数据库中查找数据，必须要用new ObjectID（_id）,要不然在数据库中查不到
//ni
const log = require("../log");
const Util = require("../util");
const processListen = require("../processlisten");
/***** Module variables *****/
let dbName, //数据库名字
    dbUrl,  //数据库连接url
    client, //数据库连接实例
    dbBase; //数据库操作对象

/**
 * @description 数据库连接
 * @param {Function} callback 
*/
const connect = (callback) => {
    callback(dbBase);
}
/**
 * @description 关闭数据库连接
 */
const close = () => {
  client && client.close();
  console.log("close db connect!");
}

/***** Module exports *****/
exports.init = (cfg) => {
    dbName = cfg.app.name;
    dbUrl = cfg.db.url;

    client = new MongoClient(dbUrl,{useNewUrlParser:true});
    client.connect(function(err) {
        if(err){
          return log.add(err,"mongodb");
        }
        dbBase = client.db(dbName);
        console.log("Connected successfully to server");
    });
}
//_id数据查询对象 new ObjectID(_id)
exports.ObjectID = ObjectID;
//数据库操作接口
/**
 * @description 插入一条数据
 * @param {string} document 数据库表名
 * @param {json} data 该条数据
 * @param {Function} callback 数据操作完的回调
 */
exports.insertOne = (document,data,callback) => {
  connect((db)=>{
    db.collection(document).insertOne(data,(err,result)=>{
      Util.tryCatch(()=>{
        callback(err,result);
      },(error)=>{
        log.add(error,"error");
      })
    })
  });
}
/**
 * @description 查找数据
 * @param {string} document 数据库表名
 * @param {json} data 查找数据的条件
 * @param {Function} callback 数据操作完的回调
 */
exports.find = (document,data,callback) => {
  connect((db)=>{
    db.collection(document).find(data,(err,result)=>{
      if(err){
        return callback(err,result);
      }
      Util.tryCatch(()=>{
        result.toArray((error, docs)=>{
          callback(error,docs);
        })
      },(error)=>{
        log.add(error,"error");
      })
    })
  });
}
/**
 * @description 查找单条数据
 * @param {string} document 数据库表名
 * @param {json} data 查找数据的条件
 * @param {Function} callback 数据操作完的回调
 */
exports.findOne = (document,data,callback) => {
  connect((db)=>{
    db.collection(document).findOne(data,(err,result)=>{
      if(err){
        return callback(err,result);
      }
      // Util.tryCatch(()=>{
      //   result.toArray((error, docs)=>{
          callback(err,result);
      //   })
      // },(error)=>{
      //   log.add(error,"error");
      // })
    })
  });
}
/**
 * @description 查找单条数据，并更新数据
 */
exports.findOneAndUpdate = (document,filter,data,callback) => {
  connect((db)=>{
    db.collection(document).findOneAndUpdate(filter,data,(err,result)=>{
      if(err){
        return callback(err,result);
      }
      // Util.tryCatch(()=>{
      //   result.toArray((error, docs)=>{
          callback(err,result);
      //   })
      // },(error)=>{
      //   log.add(error,"error");
      // })
    })
  });
}
/**
 * @description 批量更新数据
 * @param {string} document 数据库表名
 * @param {json} filter 需要修改的数据查找条件
 * @param {json} data 需要更新的属性 { $set: { b : 1 } }
 * @param {Function} callback 数据操作完的回调
 */
exports.updateMany = (document,filter,data,callback) => {
  connect((db)=>{
    db.collection(document).updateMany(filter,data,(err,result)=>{
      Util.tryCatch(()=>{
        callback(err,result);
      },(error)=>{
        log.add(error,"error");
      })
    })
  });
}
/**
 * @description 更新单条数据
 * @param {string} document 数据库表名
 * @param {json} filter 需要修改的数据查找条件
 * @param {json} data 需要更新的属性 { $set: { b : 1 } }
 * @param {Function} callback 数据操作完的回调
 */
exports.updateOne = (document,filter,data,callback) => {
  connect((db)=>{
    db.collection(document).updateOne(filter,data,(err,result)=>{
      Util.tryCatch(()=>{
        callback(err,result);
      },(error)=>{
        log.add(error,"error");
      })
    })
  });
}
/**
 * @description 删除单条数据
 * @param {string} document 数据库表名
 * @param {json} filter 需要删除的数据查找条件
 * @param {Function} callback 数据操作完的回调
 */
exports.deleteOne = (document,filter,callback) => {
  connect((db)=>{
    db.collection(document).deleteOne(filter,(err,result)=>{
      Util.tryCatch(()=>{
        callback(err,result);
      },(error)=>{
        log.add(error,"error");
      })
    })
  });
}
/**
 * @description 删除多条数据
 * @param {string} document 数据库表名
 * @param {json} filter 需要删除的数据查找条件
 * @param {Function} callback 数据操作完的回调
 */
exports.deleteMany = (document,filter,callback) => {
  connect((db)=>{
    db.collection(document).deleteMany(filter,(err,result)=>{
      Util.tryCatch(()=>{
        callback(err,result);
      },(error)=>{
        log.add(error,"error");
      })
    })
  });
}
/***** local running ******/
//监听进程退出，关闭数据库连接
processListen.addHandle("shutDown",close);

