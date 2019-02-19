/**
 * @description Module dependencies.
 * @private 
 */

/***** Module dependencies *****/
//nodejs
const url = require("url");
//ni
//config
const cfg = require("cfg.json");

/***** Module variables *****/
class Router{
    /**
     * @description 响应用户请求
     */
    response(req, res){
        let url = path.parse(req.url);
        url.pathname
        console.log(url);
        res.end();
    }
}

/***** Module exports *****/
module.exports = Router;
/***** local running ******/
