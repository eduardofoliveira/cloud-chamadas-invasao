const buscarListaChamadas = async quantidade => {
  try {
    const connection = await require('./service/mysql')()

    const [rows] = await connection.execute(`
    select
        callerid,
        pattern,
        count(callerid) as quantidade
    from
    cdrs
    where
        accountid in (select id from accounts where type = 0 and deleted = 0 and reseller_id = 0 and id not in (14, 16, 46, 55, 57, 60)) and
        callstart >= CONVERT_TZ( now(), '+00:00','+03:00') - INTERVAL 1 HOUR and
        billmsec > 1
    group by
        callerid, pattern
    order by
        quantidade desc, pattern asc`)

    connection.end()

    let lista = []

    rows.map(item => {
      if (item.quantidade >= quantidade) {
        item.callerid = item.callerid.match('<(.*)>')[1]
        lista.push([item.callerid, item.pattern, item.quantidade])
      }
    })

    return lista
  } catch (error) {
    console.log('Erro no metodo: buscarListaChamadas')
    console.log(error)
  }
}

const custoChamadasInternacionais = async () => {
  try {
    const connection = await require('./service/mysql')()

    const [[rows]] = await connection.execute(`
    SELECT
        sum(cost) as custo
    FROM
        cdrs
    WHERE
        trunk_id IN (55, 57) and
        callstart BETWEEN date_sub(NOW(), INTERVAL 24 HOUR) AND NOW() and
        callednum LIKE '010%' and
        cost > 0`)

    connection.end()

    return rows
  } catch (error) {
    console.log('Erro no metodo: custoChamadasInternacionais')
    console.log(error)
  }
}

const bloquearChamadasInternacionais = async () => {
  try {
    const connection = await require('./service/mysql')()

    await connection.execute(`
    UPDATE
      trunks
    SET
      STATUS = 1
    WHERE
      id IN (55, 57)`)

    connection.end()
  } catch (error) {
    console.log('Erro no metodo: bloquearChamadasInternacionais')
    console.log(error)
  }
}

module.exports = {
  buscarListaChamadas,
  custoChamadasInternacionais,
  bloquearChamadasInternacionais
}
