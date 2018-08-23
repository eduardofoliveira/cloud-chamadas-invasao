const mysql = require('mysql2/promise')

const buscar = async (quantidade) => {
    let lista = []

    const connection = await mysql.createConnection({
        host:'54.233.223.179',
        user: 'root',
        password: '190790edu',
        database: 'astpp'
    })

    const [rows, fields] = await connection.execute(`
    select
	    callerid,
	    pattern,
	    count(callerid) as quantidade
    from
	    cdrs
    where
	    accountid in (select id from accounts where type = 0 and deleted = 0 and reseller_id = 0 and id not in (14, 16, 46, 55, 57, 60)) and
	    profile_start_stamp >= now() - INTERVAL 1 HOUR and
	    billmsec > 1
    group by
	    callerid, pattern
    order by
        quantidade desc, pattern asc`)

    connection.close()

    rows.map(item => {
        if(item.quantidade >= quantidade){
            item.callerid = item.callerid.match('<(.*)>')[1]
            lista.push([item.callerid, item.pattern, item.quantidade])
        }
    })

    return lista
}

module.exports = {
    buscar
}