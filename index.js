require('dotenv').config()
const cron = require('node-cron')

let verificarChamadasSimultaneas = () => {
  return new Promise(async (resolve, reject) => {
    let chamadas = require('./chamadas')
    let email = require('./email')

    let ligacoes = await chamadas.buscarListaChamadas(1)
    ligacoes.map(item => {
      return (item[1] = item[1].replace('^', '').replace('.*', ''))
    })

    let enviar = false
    let corpo = ''

    ligacoes.map(item => {
      if (!enviar && item[2] >= 10) {
        enviar = true
      }
      if (item[2] >= 10) {
        corpo += `${item[0]} ${item[1]} ${item[2]}\r\n`
      }
    })

    if (enviar) {
      await email
        .enviar({
          titulo: 'Quantidade de simultaneas ASTPP',
          corpo,
          para: 'eduardo@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br'
        })
        .catch(error => {
          console.log(error)
        })
    }

    chamadas = undefined
    email = undefined
    ligacoes = undefined
    resolve()
  })
}

let verificarChamadasInternacionais = () => {
  return new Promise(async (resolve, reject) => {
    let chamadas = require('./chamadas')
    let email = require('./email')

    let { custo } = await chamadas.custoChamadasInternacionais()

    if (custo >= 100 && custo <= 149.99) {
      email.enviar({
        titulo: 'Warning valor das chamadas internacionais acima do normal',
        corpo: `O custo atual das chamadas internacionais nas ultimas 24 horas alcançou ${custo}`,
        para:
          'suporte.basix@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br'
      })
    }
    if (custo >= 150) {
      email.enviar({
        titulo: 'Provavel invasão verifique as terminações internacionais',
        corpo: `O custo atual das chamadas internacionais nas ultimas 24 horas alcançou ${custo}`,
        para:
          'suporte.basix@cloudcom.com.br, eduardo_felipe_oliveira@yahoo.com.br'
      })
      chamadas.bloquearChamadasInternacionais()
    }
    chamadas = undefined
    email = undefined
    resolve()
  })
}

cron.schedule('0 * * * *', async () => {
  try {
    await verificarChamadasSimultaneas()
    await verificarChamadasInternacionais()
  } catch (error) {
    console.log('Erro no cron.schedule')
    console.log(error)
  }
})
