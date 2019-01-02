const mysql = require('mysql');

const pool = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'alishow',
  connectionLimit:10
})

// connection.query('SELECT * FROM `ali_cate`', function (err, data) {
//   if (err) {
//     throw err
//   }
//   console.log(data)
// })

// 导出连接对象
// 连接对象中有 query 方法
// 注意：必须导出 connection，否则会报错
module.exports = pool
