const Promise = require('promise')
const fs = require('fs')
const config = require('../config.json')

const writeTempFile = (_dump_) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(config.settings.backup_path + 'tmp.sql', _dump_, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(config.settings.backup_path + 'tmp.sql')
      }
    })
  })
}

module.exports = writeTempFile
