const express = require('express')
const router = express.Router()
const isAuthenticated = require('../lib/login')
const model = require('../lib/model.js')
const aws = require('aws-sdk')
const UploadImage = model.UploadImage

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME

aws.config.update({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY
})

const s3 = new aws.S3()

router.get('/:itemId', isAuthenticated, function(req, res, next) {
  const query = {
    "_id": req.params.itemId,
  };
  UploadImage.find(query, function(err, data) {
    if (err || !data[0]) {
      console.log(error)
      res.end('error')
    }
    res.render('item', { title: 'Item', uploadImage: data[0] })
  })
})

router.post('/delete/:itemId', isAuthenticated, function(req, res, next) {
  const query = {
    "_id": req.params.itemId,
  }
  UploadImage.find(query, function(err, data) {
    if (err || !data[0]) {
      console.log(error)
      res.end('error')
    }

    const filename = data[0].path.match(/https?:\/\/.+\/(.+)$/)[1]

    s3.deleteObject({
        Bucket: S3_BUCKET_NAME,
        Key: filename,
      },
      (error, result) => {
        if (error) {
          console.log(error)
          res.end('error')
        } else {
          const query = {
            "_id": req.params.itemId,
          }
          UploadImage.remove(query, function(err, data) {
            if (error) {
              console.log(error)
              res.end('error')
            } else {
              res.redirect('/page')
            }
          })

        }
      }
    )
  })
})

module.exports = router