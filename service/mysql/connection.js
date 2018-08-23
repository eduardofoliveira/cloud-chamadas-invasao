const mysql = require('mysql')

/*const connection = mysql.createConnection({
    host: 'duduhouse.dyndns.info',
    user: 'cloud',
    password: '190790edu',
    database: 'cloud'
})*/

const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'duduhouse.dyndns.info',
    user: 'cloud',
    password: '190790edu',
    database: 'cloud'
})

const errorHandler = (error, msg, rejectFunction) => {
    console.log(error)
    rejectFunction({error: msg})
}

const chamadasModule = require('./chamadas')({pool, errorHandler})

module.exports = {
    cdrs: () => chamadasModule,
    end: () => {
        pool.end()
    }
}