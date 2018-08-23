const cron = require('node-cron')

let executar = async () => {
    let chamadas = require('./chamadas')
    let connection = require('./service/mysql/connection')
    let email = require('./email')

    ligacoes = await chamadas.buscar(1)
    ligacoes.map(item => {return item[1] = item[1].replace('^', '').replace('.*', '')})

    if(ligacoes.length >= 1){
        await connection.cdrs().inserirLista(ligacoes)
    }

    let enviar = false
    let corpo = ''

    ligacoes.map(item => {
        if(!enviar && item[2] >= 10){
            enviar = true
        }
        if(item[2] >= 10){
            corpo += `${item[0]} ${item[1]} ${item[2]}\r\n`
        }
    })

    if(enviar){
        await email.enviar(corpo)
            .catch(error => {
                console.log(error)
            })
    }

    chamadas = undefined
    connection = undefined
    email = undefined
}

cron.schedule('0 * * * *', () => {
    executar()
})