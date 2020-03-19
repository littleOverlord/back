const path = require("path");

const static = require('koa-static');
const Koa = require('koa');

const upload = require("./app/upload");
const api = require("./app/api")

const config = require("./app/app.json");

const app = new Koa();

// $ GET /hello.txt
app.use(static(path.join(process.cwd(),config.static)));

app.use(upload.routes(), upload.allowedMethods());
app.use(api.routes(), api.allowedMethods());

app.listen(3000);
