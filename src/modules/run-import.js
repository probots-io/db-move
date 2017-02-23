const shell = require('shelljs')
const log = require('../helpers/log')

const runImport = (config) => {
  return new Promise((resolve, reject) => {
    const server = config.targetServer

    log.raw(`Importing Database to ${server.host}:${server.port} / ${server.database}`)

    const commandArr = []
    commandArr.push(config.mysql)
    commandArr.push(`--host=${server.host}`)
    commandArr.push(`--port=${server.port}`)
    commandArr.push(`--user=${server.username}`)
    commandArr.push(`--password=${server.password}`)
    commandArr.push(server.database)
    commandArr.push(`< "${config.backupFolder}/tmp.sql"`)

    const command = commandArr.join(' ')

    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code === 0) {
        resolve(true)
      } else {
        reject({ message: stderr })
      }
    })
  })
}

module.exports = runImport
