const mongoose = require('mongoose')
const config = require('./config')
const url = config.mongo
const db = mongoose.createConnection(url, function(err, res) {
  if (err) {
    console.log('Error connected: ' + url + ' - ' + err)
  } else {
    console.log('Success connected: ' + url)
  }
})

// Modelの定義
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String
}, { collection: 'users' })

const UploadImageSchema = new mongoose.Schema({
  username: String,
  path: String,
  private: Boolean,
}, { collection: 'uploadImage' })

exports.User = db.model('User', UserSchema)
exports.UploadImage = db.model('UploadImage', UploadImageSchema)