const chamadas = deps => {
    return {
        inserirLista: (lista) => {
            return new Promise((resolve, reject) => {
                const { pool, errorHandler } = deps
                pool.query('INSERT INTO chamadasAstpp (did, prefix, simultaneas) values ?', [lista], (error, results) => {
                    if(error){
                        errorHandler(error, 'Falha ao inserir registros na tabela chamadasAstpp', reject)
                    }
                    resolve({chamadas: results})
                })
            })
        }
    }
}

module.exports = chamadas