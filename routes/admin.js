// 提供后台管理系统相关视图渲染路由
const express = require('express')
const router = express.Router()
const db = require('../utils/db')

router.get('/admin', (req, res, next) => {
    res.render('admin/index.html')
})

router.get('/admin/login', (req, res, next) => {
    res.render('admin/login.html')
})

router.get('/admin/posts', (req, res, next) => {
    res.render('admin/posts.html')
})

router.get('/admin/categories', (req, res, next) => {
    res.render('admin/categories.html')
})

router.get('/admin/comments', (req, res, next) => {
    res.render('admin/comments.html')
})

router.get('/admin/nav-menus', (req, res, next) => {
    res.render('admin/nav-menus.html')
})

router.get('/admin/password-reset', (req, res, next) => {
    res.render('admin/password-reset.html')
})

router.get('/admin/profile', (req, res, next) => {
    res.render('admin/profile.html')
})

router.get('/admin/settings', (req, res, next) => {
    res.render('admin/settings.html')
})

router.get('/admin/slides', (req, res, next) => {
    res.render('admin/slides.html')
})

router.get('/admin/users', (req, res, next) => {
    res.render('admin/users.html')
})

// router.get('/admin/posts-new', (req, res, next) => {
//     res.render('admin/posts-new.html')
// })

router.get('/admin/posts-new', (req, res, next) => {
    db.query('SELECT * from `ali_cate`', (err, ret) => {
      if (err) {
        return next(err)
      }
      res.render('admin/posts-new.html', {
        categories: ret
      })
    })
  })
module.exports = router