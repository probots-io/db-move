const fs = require('fs-extra')
const shell = require('shelljs')

const log = require('../helpers/log')

const runDump = (config) => {
  return new Promise((resolve, reject) => {

    const server = config.sourceServer

    log.raw(`Dumping Database from ${server.host}:${server.port} / ${server.database}`)

    fs.ensureDirSync(config.backupFolder)

    const commandArr = []
    commandArr.push(config.mysqldump)
    commandArr.push(`--host=${server.host}`)
    commandArr.push(`--port=${server.port}`)
    commandArr.push(`--user=${server.username}`)
    commandArr.push(`--password="${server.password}"`)
    commandArr.push(server.database)
    server.exclude_tables.forEach(table => {
      commandArr.push(`--ignore-table=${server.database}.${table}`)
    })
    commandArr.push('--single-transaction')
    commandArr.push('--quick')
    commandArr.push('--lock-tables=false')
    commandArr.push(`> "${config.backupFolder}/tmp.sql"`)

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

module.exports = runDump
