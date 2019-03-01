'use strict';
/**
 * @description Module dependencies.
 * @private 
 */

/***** Module dependencies *****/

/***** Module variables *****/

/***** Module exports *****/
exports.test = (req, res, search) => {
    console.log(search);
    res.writeHead(200,{"content-type":"text/plain"});
    res.write(`{"money":100}`);
    res.end();
}
/***** local running ******/
