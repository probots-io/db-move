var shell = require('shelljs')

const runBackup = (config) => {
  return new Promise(resolve => {

    const server = config.targetServer

    const commandArr = []
    commandArr.push(config.mysqldump)
    commandArr.push(`--host=${server.host}`)
    commandArr.push(`--port=${server.port}`)
    commandArr.push(`--user=${server.username}`)
    commandArr.push(`--password=${server.password}`)
    commandArr.push(server.database)
    server.exclude_tables.forEach(table => {
      commandArr.push(`--ignore-table=${server.database}.${table}`)
    })
    commandArr.push('--single-transaction')
    commandArr.push('--quick')
    commandArr.push('--lock-tables=false')
    commandArr.push(`> "${config.backupFolder}/${config.backupFileName}"`)

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

module.exports = runBackup
