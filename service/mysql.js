const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE
})

const fecharConexao = async () => {
  let conn = await connection
  conn.end()
}

module.exports = {
  connection,
  fecharConexao
}
