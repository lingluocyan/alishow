const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const moment = require('moment')

router.get('/api/categories', (req, res, next) => {
  // 1. 操作数据库获取数据
  // 2. 把数据响应给客户端
  db.query('SELECT * FROM `ali_cate`', function (err, data) {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data
    })
  })
})

router.get('/api/categories/delete', (req, res, next) => {
  // 获取要删除的数据id
  const {
    id
  } = req.query

  // 操作数据库，执行删除
  db.query('DELETE FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      ret
    })
  })
})

// 添加数据
router.post('/api/categories/add', (req, res, next) => {
  var body = req.body
  db.query('INSERT INTO `ali_cate` SET ?', body, (err, ret) => {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data: ret
    })
  })
})
// router.post('/api/categories/add', (req, res, next) => {
//   // res.send(req.body)
//   const body = req.body
//   body.cate_createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
//   db.query('INSERT INTO `ali_cate` SET ?', body, (err, ret) => {
//     if (err) {
//       return next(err)
//     }
//     res.send({
//       success: true,
//       data: ret
//     })
//   })
// })
//编辑数据
router.get('/api/categories/query', (req, res, next) => {
  // 1. 获取查询字符串中的 id
  const {
    id
  } = req.query
  // 2. 执行数据库查询操作
  db.query('SELECT * FROM `ali_cate` WHERE `cate_id`=?', [id], (err, ret) => {
    if (err) {
      return next(err)
    }
    // 3. 发送响应
    res.send({
      success: true,
      data: ret[0]
    })
  })
})
//更新数据
router.post('/api/categories/update', (req, res, next) => {
  const body = req.body
  // body.cate_createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
  db.query('UPDATE `ali_cate` SET `cate_name`=?,`cate_slug`=? WHERE `cate_id`=?', [body.cate_name, body.cate_slug, body.cate_id], (err, ret) => {

    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data: ret
    })
  })
})

module.exports = router