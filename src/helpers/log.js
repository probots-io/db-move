const chalk = require('chalk')

const log = () => {

  const log = (string) => {
    console.log(`# ${string}`)
  }

  const raw = (string) => {
    log(string)
  }
  const success = (string) => {
    log(chalk.green(string))
  }
  const error = (string) => {
    log(chalk.white.bgRed(string))
  }
  const info = (string) => {
    log(chalk.cyan(string))
  }
  const warning = (string) => {
    log(chalk.orange(string))
  }

  return {
    raw, success, error, info, warning
  }
}

module.exports = log()
