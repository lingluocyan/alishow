const express = require('express')
const router = express.Router()
const db = require('../../utils/db')
const md5 = require('md5')
// users
router.get('/api/users', (req, res, next) => {
  db.query('SELECT * FROM `ali_admin`', function (err, data) {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      data
    })
  })
})

// users删除
router.get('/api/users/delete', (req, res, next) => {
  const {
    id
  } = req.query
  db.query('DELETE FROM `ali_admin` WHERE `admin_id`=?', [id], function (err, ret) {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      ret
    })
  })
})

//users添加
router.post('/api/users/add', (req, res, next) => {
  const body = req.body
  // 验证邮箱
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [body.admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }
    if (ret[0]) {
      return res.send({
        success: false,
        messages: '邮箱已经被占用'
      })
    }
    //验证别名
    db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?', [body.admin_slug], (err, ret) => {
      if (err) {
        return next(err)
      }
      if (ret[0]) {
        return res.send({
          success: false,
          messages: '别名已经被占用'
        })
      }
      //验证通过执行插入
      db.query('INSERT INTO `ali_admin` SET ?', {
        admin_email: body.admin_email,
        admin_slug: body.admin_slug,
        admin_nickname: body.admin_nickname,
        admin_pwd: md5(md5(body.admin_pwd))
      }, (err, ret) => {
        if (err) {
          return next(err)
        }
        res.send({
          success: true,
          ret
        })
      })
    })
  })
})

// 邮箱,昵称,别名验证功能补全
router.get('/api/users/check/email', (req, res, next) => {
  // admin_email
  // const { admin_email } = req.query
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?', [req.query.admin_email], (err, ret) => {
    if (err) {
      return next(err)
    }
    if (ret[0]) {
      res.send(false)
    } else {
      res.send(true)
    }
  })
})

router.get('/api/users/check/slug', (req, res, next) => {
  db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?', [req.query.admin_slug], (err, ret) => {
    if (err) {
      return next(err)
    }
    if (ret[0]) {
      return res.send(false)
    }
    res.send(true)
  })
})
router.get('/api/users/check/nickname', (req, res, next) => {
  db.query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?', [req.query.admin_nickname], (err, ret) => {
    if (err) {
      return next(err)
    }
    if (ret[0]) {
      return res.send(false)
    }
    res.send(true)
  })
})
//密码没必要验证重复会降低安全性
// router.get('/api/users/check/pwd',(req,res,next)=>{
//   db.query('SELECT * FROM `ali_admin` WHERE `admin_pwd`=?',[req.admin_pwd],(err,ret)=>{
//     if(err) {
//       return next(err)
//     }
//     if(ret[0]) {
//       return res.send(false)
//     }
//     res.send(true)
//   })
// })

//编辑功能
router.get('/api/users/query', (req, res, next) => {
  const {
    id
  } = req.query
  db.query('SELECT * FROM `ali_admin` WHERE `admin_id`=?', [id], (err, ret) => {
    if (err) {
      return next(err)
    }
    res.send({
      success: true,
      data: ret[0],
    })
  })
})
//编辑更新功能
router.post('/api/users/update', (req, res, next) => {
  var body = req.body
  db.query('UPDATE `ali_admin` SET `admin_email`=?,`admin_slug`=?,`admin_nickname`=? WHERE `admin_id`=?',
    [
      body.admin_email,
      body.admin_slug,
      body.admin_nickname,
      body.admin_id
    ], (err, ret) => {
      if (err) {
        return next(err)
      }
      res.send({
        success: true,
        data: ret[0],
      })
    })
})

//登录
router.post('/api/users/login',(req,res,next)=>{
  // post请求,运用body-parser插件获取请求体
  const body = req.body
  db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?',[body.admin_email],(err,ret)=>{
    if(err) {
      return next(err)
    }
    // 定义一个user接收结果
    const user = ret[0]
    //如果没有数据
    if(!user) {
      return res.send({
        success:false,
        message:'用户不存在'
      })
    }
    //判断密码是否正确,因为数据库里面的数据是经过两次加密所以也要两次加密后进行比对
    if(md5(md5(body.admin_pwd)) !== user.admin_pwd) {
      return res.send({
        success:false,
        message:'密码错误!'
      })
    }
    //代码走到这里说明登录成功，使用session记录登录状态，user里存的是用户的登录信息
    req.session.user = user
    res.send({
      success:true,
    })
  })
})

module.exports = router