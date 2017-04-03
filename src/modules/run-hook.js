var fetch = require('node-fetch')
const log = require('../helpers/log')

const runHook = (type, config) => {
  return new Promise((resolve, reject) => {
    const server = (type === 'before') ? config.sourceServer : config.targetServer
    if(!server.webhooks || !server.webhooks[type] || server.webhooks[type] == '') {
      resolve()
    }

    log.raw(`[${type}] Executing Webhook to ${server.webhooks[type]}`)

    fetch(server.webhooks[type], { method: 'POST' })
      .then(response => resolve(response))
      .catch(ex => {
        resolve()
      })

  })

}

module.exports = runHook
