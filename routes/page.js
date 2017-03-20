const express = require('express')
const router = express.Router()
const isAuthenticated = require('../lib/login')
const fs = require('fs')
const aws = require('aws-sdk')
const model = require('../lib/model.js')
const UploadImage = model.UploadImage

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME

aws.config.update({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY
})

const s3 = new aws.S3()

router.get('/', isAuthenticated, function(req, res, next) {
  const query = {
    "username": req.session.username,
  };
  UploadImage.find(query, function(err, data) {
    res.render('page', { title: 'Page', uploadImages: data })
  })
})
router.post('/', isAuthenticated, function(req, res, next) {
  const buffer = fs.readFileSync(req.file.path)
  s3.upload({
      Bucket: S3_BUCKET_NAME,
      Key: req.file.filename,
      Body: buffer,
      ACL: 'public-read',
    },
    (error, result) => {
      if (error) {
        console.log(error)
        res.end('error')
      } else {
        const newUploadImage = new UploadImage()
        newUploadImage.username = req.session.username
        newUploadImage.itemname = req.body.itemname || 'untitled'
        newUploadImage.path = result.Location
        newUploadImage.private = false
        newUploadImage.save((err) => {
          if (err) {
            console.log(error)
            res.end('error')
          } else {
            res.end(`<html><body>アップロードしました<img src=${result.Location}></body></html>`)
          }
        })
      }
    }
  )
})

module.exports = router