const express = require('express')
const path = require('path')
const router = require('./router')
const bodyparser = require('body-parser')
const glob = require('glob')
const session = require('express-session')
const checkLogin = require('./middlewares/check-login')
// 配置session数据持久化
const MySQLStore = require('express-mysql-session')(session)

const sessionStore = new MySQLStore({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'alishow'
})

const app = express()
//配置session
app.use(session({
  secret: 'keyboard cat', //设置加密密匙
  resave: false, //
  store: sessionStore, // 告诉 express-session 这个插件，使用 sessionStore 来持久化 Session 数据
  saveUninitialized: true, //无论是否存储session数据，都给客户端发一个小票,false则只有存的时候才给小票
  cookie: {
    // maxAge: 1000*60  滑动过期事件,给一个毫秒数,相对于当前时间往后增加
    // 这里配置的 Cookie过期并不适合实现记录的功能
    //Session不仅仅存储用户登录信息,在会话期间还会有别的数据
    //因为每次往Session写数据都会更新这个时间
    // expires:'日期对象'  需求日期对象，绝对的过期时间，例如xx年xx日xx时xx分xx秒
    // Cookie的过期与否取决于浏览器浏览
    // 浏览器每次发送Cookie的时候，发现如果过期就不发,没过期才发
  }
})) //配置好后会给req添加一个session成员，往session写入数据 req.session.xxx = xxx,读取req.session.xxx
//默认情况下，服务端session是保存在内存中，一旦服务器重启,session数据就会丢失


// 配置art-template模板引擎
app.engine('html', require('express-art-template'))

app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})

app.use(bodyparser.urlencoded({
  extended: false
}))

// app.use(bodyparser.json)

// 公开静态资源，在路由注册之前
app.use('/public', express.static(path.join(__dirname, './public')))
// app.use(router)
// 加载routes里面所有的路由模块
// app.use(require('./routes/index'))
// 获取routes目录中所有的js路由模块文件路径
// 循环加载
// glob('./routes/*.js',function(err,files){
//   //只查找一级
// })

//挂载路由之前同意检验管理系统的页面访问权限
//就是校验所有已/admin开头的页面请求路径,不包含/admin/login
app.use('/admin', checkLogin({
  app: app
}))

// 自动挂载路由模块
const files = glob.sync(path.join(__dirname, './routes/**/*.js'))
files.forEach((routerPath => {
  app.use(require(routerPath))
}))

// 特殊的路由(中间件)
// 当其他路由的处理函数执行这个中间件就会被调用
app.use((err, req, res, next) => {
  // 返回状态码500说明是服务端出了问题
  res.status(500).send({
    // 详细描述错误信息
    statusCode: 500,
    message: 'Internal Server Error',
    err: err.message
  })
})


app.listen(3000, function () {
  console.log('running in 3000')
})
// const express = require('express')
// const path = require('path')
// const router = require('./router')

// const app = express()

// // 第一个参数用来指定模板文件的后缀名
// app.engine('html', require('express-art-template'))
// app.set('view options', {
//   debug: process.env.NODE_ENV !== 'production'
// })

// app.use('/public', express.static(path.join(__dirname, './public')))

// // 把独立的路由系统整合到 Express 应用中
// app.use(router)

// app.listen(3000, () => {
//   console.log('Server running http://127.0.0.1:3000/')
// })