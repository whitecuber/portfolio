const express = require('express')
const router = express.Router()
const isAuthenticated = require('../lib/login')
const model = require('../lib/model.js')
const Folder = model.Folder

const categoryMaster = require('../lib/const/category').default

router.post('/', function(req, res, next) {
  if (!categoryMaster[req.body.categoryId]) {
    console.log('invalid categoryId', req.body.categoryId)
    res.end('error')
  }
  const newFolder = new Folder();
  newFolder.username = req.session.username
  newFolder.folderName = req.body.folderName
  newFolder.category = req.body.categoryId
  newFolder.private = req.body.private
  newFolder.save(function(err) {
    if (err) {
      console.log(err)
      res.end('error')
    } else {
      res.redirect('/page')
    }
  })
})

module.exports = router;