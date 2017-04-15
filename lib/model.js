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
exports.User = db.model('User', UserSchema)

const UploadImageSchema = new mongoose.Schema({
  username: String,
  path: String,
  folderId: String,
  updateAt: { type: Date, default: Date.now },
  createAt: { type: Date, default: Date.now },
}, { collection: 'uploadImage' })
exports.UploadImage = db.model('UploadImage', UploadImageSchema)

const FolderSchema = new mongoose.Schema({
  username: String,
  folderName: String,
  category: Number,
  private: Boolean,
}, { collection: 'folders' })
exports.Folder = db.model('Folder', FolderSchema)