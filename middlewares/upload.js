// //用于解析带文件的请求
const multer = require('multer')
const path = require('path')
// //配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //解析出来的文件存放的位置
    cb(null, 'public/template')
  },
  filename: function (req, file, cb) {
    //获取文件的后缀名
    const extName = path.extname(file.originalname)
    //动态拼接文件的名称
    cb(null, `${file.fieldname}-${Date.now()}${extName}`)
  }
})

const upload = multer({
  storage: storage
})
// //把对象导出,想要使用该组件只需要引入
module.exports = upload