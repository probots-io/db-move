const chalk = require('chalk')

const runHook = require('./modules/run-hook')
const runDump = require('./modules/run-dump')
const runReplace = require('./modules/run-replace')
const runBackup = require('./modules/run-backup')
const runImport = require('./modules/run-import')
const log = require('./helpers/log')


const runner = (config) => {

  log.success('Starting Database Transfer')

  runHook('before', config)
    .then(() => runDump(config))
    .then(() => runReplace(config))
    .then(() => runBackup(config))
    .then(() => runImport(config))
    .then(() => runHook('after', config))
    .then(() => {
      const end = new Date() - config.start
      log.success(`Finished in ${Math.round((end / 1000) * 100) / 100}s`)
      log.raw('===============================')
      log.raw(`${chalk.magenta('Enjoyed this?')} Follow me on Twitter: ${chalk.magenta('@derpoho')}`)
      log.raw('===============================')
    })
    .catch(err => {
      log.error(`Oh no, an Error occured:`)
      if(err.message) {
        log.raw(chalk.red(err.message))
      } else {
        log.raw(err)
      }
    })

}

module.exports = runner
