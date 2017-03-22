const express = require('express')
const router = express.Router()
const isAuthenticated = require('../lib/login')
const fs = require('fs')
const aws = require('aws-sdk')
const model = require('../lib/model.js')
const User = model.User
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
    res.render('page', { title: 'Page', uploadImages: data, csrf: req.csrfToken() })
  })
})
router.get('/:username', isAuthenticated, function(req, res, next) {
  // Userテーブルにそのユーザーがいるか確認
  const query = {
    "username": req.params.username,
  }
  User.findOne(query, function(err, userData) {
    if (err) {
      console.log(err);
      res.end('error')
    } else {
      if (!userData) {
        res.end('user not found')
      } else {
        const query = {
          "username": req.params.username,
          "private": false,
        }
        UploadImage.find(query, function(err, data) {
          res.render('userpage', { title: 'UserPage', user: userData, uploadImages: data })
        })
      }
    }
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
            console.log(err)
            res.end('error')
          } else {
            res.redirect('/page')
          }
        })
      }
    }
  )
})

module.exports = router