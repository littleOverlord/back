const path = require("path");

const router = require('koa-router')();

const Common = require("../../ni/common");

/**
 * @description 解析接口
 * @param {*} type 接口名 "app/airport@save" @ 之前是服务模块路径 @ 之后是服务函数名
 */
const parseUrl = (type) => {
  let arr = type.split("@");
  return {
    module: arr[0],
    method: arr[1]
  }
}

router.post('/api',async (ctx, next) => {
  // 返回原文件名
  
  let data = await Common.getPostData(ctx),param,mod,result;
  try{
    data = JSON.parse(data);
    param = parseUrl(data.type);
    mod = require(path.join(process.cwd(),param.module));
    result = await mod[param.method](ctx,data.data);
    Common.mergeResponse(ctx,result);
  }catch(e){
    console.log(e);
    Common.mergeResponse(ctx,{
      code:500,
      message:e.reason
    });
  }
})

module.exports = router
