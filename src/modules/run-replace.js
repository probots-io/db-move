const fs = require('fs-extra')
const chalk = require('chalk')

const peach = require('../helpers/peach')
const log = require('../helpers/log')

const runReplace = (config) => {
  return new Promise((resolve) => {
    const sourceFile = `${config.backupFolder}/tmp.sql`

    log.raw(`Running Replacers`)

    const saveReplace = config.targetServer.replace.host.indexOf(config.sourceServer.replace.host) >= 0
    let replacement = config.targetServer.replace.host
    if (saveReplace) {
      log.raw("Performing save replace in 2 runs since old domain is substring of new one")
      let tmpReplaceDomain = config.targetServer.replace.host.replace(/[a-z]/g, "x")
      replacement = tmpReplaceDomain
    }

    fs.readFile(sourceFile, 'utf-8', (err, data) => {
      if (saveReplace) {
        log.raw(`Run 1 - Replacing ${config.sourceServer.replace.host} with ${replacement}`)
      }
      const migratedData = peach.migrate(data, config.sourceServer.replace.host, replacement)
      fs.writeFileSync(sourceFile, migratedData.new_haystack)
      log.raw(`Replaced ${chalk.cyan(migratedData.replaced_count)} occurrences ( ${chalk.cyan(migratedData.serialized_count)} serialized ). Modified Characters: ${chalk.cyan(migratedData.char_diff)}`)

      if (saveReplace) {
          log.raw(`Run 2 - Replacing ${replacement} with ${config.targetServer.replace.host}`)
          fs.readFile(sourceFile, 'utf-8', (err, data) => {
            const migratedData = peach.migrate(data, replacement, config.targetServer.replace.host)
            fs.writeFileSync(sourceFile, migratedData.new_haystack)
            log.raw(`Replaced ${chalk.cyan(migratedData.replaced_count)} occurrences ( ${chalk.cyan(migratedData.serialized_count)} serialized ). Modified Characters: ${chalk.cyan(migratedData.char_diff)}`)
        })
        resolve()
      }
      resolve()
    })
  })
}

module.exports = runReplace
