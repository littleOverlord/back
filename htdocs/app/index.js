'use strict';
/**
 * @description app start module.
 * @private 
 */
/***** Module dependencies *****/
//node

//ni
require("../ni");
const log = require("../ni/log");
const Static = require("../ni/static");
const server = require("../ni/server");
const db = require("../ni/db");
//config
const config = require("./cfg.json");
/***** Module variables *****/

/***** Module exports *****/

/***** local running ******/
//init log
log.init(config);
//start server
server.serverStart(config);
//init static res
Static.init(config);
//init mongodb
db.init(config);