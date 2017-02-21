#! /usr/bin/env node

const meow = require('meow')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')

const runner = require('./runner')
const log = require('./helpers/log')
const isValidConfig = require('./modules/validate-configuration')


/**
 * Base Setup
 */
const start = new Date()

/**
 * Get Config File
 */
const cli = meow(`
    Usage
      $ foo <input>

    Options
      --config, -c Configuration File
      --source, -s  Source
      --target, -t  Target

    Examples
      $ dbMove --config=./config.json --direction=pull --source=production --target=development
`, {
    alias: {
        c: 'config',
        e: 'exec'
    }
})

log.raw('Welcome!')

if(!cli.flags.source || cli.flags.source == '') {
    log.error('source Option not found.')
    cli.showHelp()
    process.exit()
}

if(!cli.flags.target || cli.flags.target == '') {
    log.error('target Option not found.')
    cli.showHelp()
    process.exit()
}

let configFilePath = path.resolve('.dbrc')

if(cli.flags.config && cli.flags.config !== '') {
    let configFilePath = cli.flags.config
}

const userConfigPath = path.resolve(configFilePath)

if(!fs.existsSync(userConfigPath)) {
    log.error(`Configuration file not found in ${userConfigPath}`)
    cli.showHelp()
    process.exit()
}

const userConfig = fs.readJsonSync(userConfigPath)

if(!isValidConfig(userConfig)) {
    log.error('Configuration object is invalid')
    cli.showHelp()
    process.exit()
}

const execDirection = cli.flags.direction
const sourceServer = userConfig.stages[cli.flags.source]
const targetServer = userConfig.stages[cli.flags.target]

if(!sourceServer) {
    log.error('Source Server object is invalid')
    cli.showHelp()
    process.exit()
}

if(!targetServer) {
    log.error('Target Server object is invalid')
    cli.showHelp()
    process.exit()
}

const backupFilename = `${cli.flags.target}-${start.getTime()}.sql`

const appConfig = {
    mysqldump: userConfig.paths.mysqldump,
    mysql: userConfig.paths.mysql,
    backupFolder: path.resolve(userConfig.paths.backups),
    start: start,
    backup: targetServer.backup,
    backupFileName: backupFilename,
    source: cli.flags.source,
    target: cli.flags.target,
    sourceServer: sourceServer,
    targetServer: targetServer
}

/**
 * Go for it
 */
log.raw('===============================')
log.raw(`Moving Database from ${chalk.cyan(appConfig.source)} to ${chalk.cyan(appConfig.target)}`)
log.raw('===============================')
log.raw(`Config: ${chalk.cyan(userConfigPath)}`)
log.raw(`Source: [${chalk.cyan(appConfig.source)}] ${appConfig.sourceServer.host}:${appConfig.sourceServer.port} / ${appConfig.sourceServer.database}`)
log.raw(`Target: [${chalk.cyan(appConfig.target)}] ${appConfig.targetServer.host}:${appConfig.targetServer.port} / ${appConfig.targetServer.database}`)
log.raw(`Backups: ${chalk.cyan(appConfig.backup ? 'Yes' : 'No')}`)

if(appConfig.backup) {
    log.raw(`Backup File: ${chalk.cyan(appConfig.backupFileName)}`)
}
log.raw('===============================')

/**
* Run run
*/
inquirer.prompt([
  {
    type: 'confirm',
    message: 'Is the data above ok and should we proceed? ',
    name: 'confirmed',
    default: false
  }
]).then(answers => {
  runner(appConfig)
})
