let getConnection = () => {
  const mysql = require('mysql2/promise')

  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    socketPath: process.env.MYSQL_SOCKET,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
  })

  return connection
}

module.exports = getConnection
