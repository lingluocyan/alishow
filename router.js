const express = require('express')
const router = express.Router()
const db = require('./utils/db')
const moment = require('moment')


//nav-menus渲染
router.get('/api/nav-menus', (req, res, next) => {
  db.query('SELECT * FROM `ali_cate`', function (err, data) {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      data
    })
  })
})
//nav-menus删除
router.get('/api/nav-menus/delete', (req, res, next) => {
  const {
    id
  } = req.query;
  db.query('DELETE FROM `ali_cate` WHERE `cate_id` = ?', [id], function (err, ret) {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      ret
    })
  })
})

module.exports = router