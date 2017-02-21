const fs = require('fs-extra')
const chalk = require('chalk')

const peach = require('../helpers/peach')
const log = require('../helpers/log')

const runReplace = (config) => {
  return new Promise(resolve => {
    const sourceFile = `${config.backupFolder}/tmp.sql`

    log.raw(`Running Replacers`)

    fs.readFile(sourceFile, 'utf-8', (err, data) => {
      const migratedData = peach.migrate(data, config.sourceServer.replace.host, config.targetServer.replace.host)
      fs.writeFileSync(sourceFile, migratedData.new_haystack)
      log.raw(`Replaced ${chalk.cyan(migratedData.replaced_count)} occurrences ( ${chalk.cyan(migratedData.serialized_count)} serialized ). Modified Characters: ${chalk.cyan(migratedData.char_diff)}`)
      resolve()
    })
  })
}

module.exports = runReplace
