﻿/**
 * @description Module dependencies.
 * @private 
 */

/***** Module dependencies *****/
//node modules
const cluster = require('cluster');
const http = require('http');
const { exec } = require('child_process');

//private modules
//app modules
//cfg

/***** Module variables *****/
const children = {};
const processType = {
    "cacl":1
}
class Child{
    constructor(worker){
        
    }
}
/***** Module exports *****/

/***** local running ******/
if (cluster.isMaster) {


} else {

}