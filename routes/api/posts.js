const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const upload = require('../../middlewares/upload')
const multer = require('multer')
const moment = require('moment')
// const upload = multer({
//   dest: 'public/template', // 设置上传的文件保存的路径，相对于执行 node 的路径
// })

// 告诉 upload.single 它，表单数据中 article_file 是我们上传的文件
router.post('/api/posts/create', upload.single('article_file'), (req, res, next) => {
  // 1. 获取表单数据
  const {
    body,
    file
  } = req
  // const body = req.body
  // req.body 是通过 body-parser 中间件解析出来的
  // body-parser 只能解析请求的 Content-Type 为 x-www-form-urlencoded 格式数据
  // 带有文件的表单 POST 提交的 Content-Type 为 multipart/form-data 格式数据
  // console.log(req.body)

  // 2. 保存到数据库
  db.query('INSERT INTO `ali_article` SET ?', {
    article_title: body.article_title,
    article_slug: body.article_slug,
    article_file: `/${file.destination}/${file.filename}`, // /public/xxx
    article_cateid: body.article_cateid,
    article_addtime: body.article_addtime,
    article_status: body.article_status,
    article_body: body.article_body,
    // article_addtime: '2018-12-30 11:20:55',
    article_adminid: req.session.user.admin_id, // 文章作者，就是当前登录的用户
  }, (err, ret) => {
    if (err) {
      return next(err)
    }
    // 3. 发送响应结果
    res.send({
      success: true,
      data: ret
    })
  })
})

//处理posts页面渲染
router.get('/api/posts', (req, res, next) => {
  db.query('SELECT * FROM `ali_article`', function (err, data) {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data
    })
  })
})
//处理posts删除
router.get('/api/posts/delete', (req, res, next) => {
  const {
    id
  } = req.query
  db.query('DELETE FROM `ali_article` WHERE `article_id`=?', [id], function (err, data) {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data
    })

  })
})
//处理posts编辑
router.get('/api/posts/edit', (req, res, next) => {
  const {
    id
  } = req.query
  db.query('SELECT * FROM `ali_article` WHERE `article_id`=?', [id], (err, ret) => {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data: ret[0],
    })
  })
})
//处理Posts编辑更新
router.post('/api/posts/update', (req, res, next) => {
  var body = req.body
  db.query('UPDATE `ali_article` SET `article_title`=?,`article_adminid`=?,`article_cateid`=?,`article_addtime`=?,`article_status`=? WHERE `article_id`=?',
    [
      body.article_title,
      body.article_adminid,
      body.article_cateid,
      body.article_addtime,
      body.article_status,
      body.article_id
    ], (err, data) => {
      if (err) {
        return next(err)
      }
      res.send({
        success: true,
        data: data[0]
      })
    }
  )
})

//处理阿里百秀index主页面的请求
router.get('/api/index', (req, res, next) => {
  //设置页码和每次取出的数据
  //如果没有传入page和limit就是默认的值
  let {
    _page = 1, _limit = 5
  } = req.query
  //转换为数字类型方便操作
  _page = parseInt(_page)
  _limit = parseInt(_limit)
  //查询区间范围的数据
  // limit后面的两个问号第一个是跳过几个值获取数据,第二个问号是取几个数据
  db.query('SELECT * FROM `ali_article` LIMIT ?,?',
    [
      (_page - 1) * _limit,
      _limit
    ],
    (err, listRet) => {
      if (err) {
        return next(err)
      }
      // moment(listRet.list.article_addtime).format('YYYY-MM-DD HH:mm:ss')
      
      //获取当前表中总数据的数量
      db.query('SELECT COUNT(*) as `count` FROM `ali_article`', (err, countRet) => {
        if(err) {
          return next(err)
        }
        // moment(listRet.article_addtime).format('MMMM Do YYYY, h:mm:ss a');
        res.send({
          success:true,
          data:{
            //传过去数据列表和总数量
            list:listRet,
            count:countRet[0].count,
          }
        })
      })
    }
  )
})

module.exports = router