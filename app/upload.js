const router = require('koa-router')()
const multer = require('koa-multer')

const Common = require("../ni/common");

const storage = multer.diskStorage({
  // 文件保存路径,注意windows和linux系统存储路径写法区别，否则会报404错误
  destination: function (req, file, cb) {
    cb(null, 'htdocs/uploads/')//path.resolve('public/uploads') // windows
    // cb(null, '/usr/local/themesui-server/public/uploads') // linux
  },
  //修改文件名称
  filename: function (req, file, cb) {
    const fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Common.str2Md5(file.originalname) + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
const upload = multer({
  storage: storage,
  limits: {
    // fileSize: 1024 * 1024 / 2 // 限制512KB
    fileSize: 1024 * 1024 * 20 // 限制15M
  }
});

router.prefix('/upload')

router.post('/', upload.single('file'), async (ctx, next) => {
  // 返回原文件名
  let name = ctx.req.file.originalname;
  console.log(ctx.req.file)
  let url = `/uploads/${ctx.req.file.filename}`
  ctx.body = {
    code:200,
    name,
    url
  }
})

module.exports = router
