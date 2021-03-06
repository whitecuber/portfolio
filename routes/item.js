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
  UploadImage.findOne(query, function(err, data) {
    if (err || !data) {
      if (err) {
        console.log(err)
      }
      res.end('error')
    } else {
      res.render('item', { title: 'Item', session: req.session, uploadImage: data, csrf: req.csrfToken() })
    }
  })
})

router.post('/delete/:itemId', isAuthenticated, function(req, res, next) {
  const query = {
    "_id": req.params.itemId,
    "username": req.session.username,
  }
  UploadImage.findOne(query, function(err, data) {
    if (err || !data) {
      if (err) {
        console.log(err)
      }
      res.end('error')
    } else {
      const filename = data.path.match(/https?:\/\/.+\/(.+)$/)[1]

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
              if (err) {
                console.log(err)
                res.end('error')
              } else {
                res.redirect('/page')
              }
            })
          }
        }
      )
    }
  })
})

module.exports = router