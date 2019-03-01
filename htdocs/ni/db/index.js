'use strict';
/**
 * @description util Module.
 * @private 
 */
/***** Module dependencies *****/
//third party
const MongoClient = require('mongodb').MongoClient;
//ni

/***** Module variables *****/
let dbName, //数据库名字
    dbUrl,  //数据库连接url
    client; //数据库操作对象
/***** Module exports *****/
exports.init = (cfg) => {
    dbName = cfg.app.name;
    dbUrl = cfg.db.url;
    client = new MongoClient(dbUrl);
    client.connect(function(err) {
        console.log(err);
        console.log("Connected successfully to server");
      
        const db = client.db(dbName);
        const collection = db.collection('documents');
        console.log(collection,db);
        client.close();
      });
}
/***** local running ******/
