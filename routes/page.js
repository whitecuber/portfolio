const express = require('express')
const router = express.Router()
const isAuthenticated = require('../lib/login')
const fs = require('fs')
const aws = require('aws-sdk')
const fileType = require('file-type')
const model = require('../lib/model.js')
const passwordChecker = require('../lib/password-checker.js')
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
  upload(req, req.session.username, () => {
    res.redirect('/page')
  })
})

router.post('/api/upload/', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const query = {
    "username": username,
  };
  User.find(query, function(err, data) {
    if (err) {
      console.log(err)
      res.end('error')
    } else {
      if (data.length == 0) {
        console.log('user not found')
        res.end('error')
      } else {
        if (passwordChecker.check(password, data[0].hash)) {
          upload(req, req.body.username, () => {
            res.end('success')
          })
        } else {
          console.log('password invalid')
          res.end('error')
        }
      }
    }
  })
})

function upload(req, username, success) {
  if (!req.file) {
    return res.end('file not selected')
  }
  const buffer = fs.readFileSync(req.file.path)
  const uploadFileType = fileType(buffer)
  if (uploadFileType == null || uploadFileType.mime.indexOf('image') < 0) {
    return res.end('file type error')
  }

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
        newUploadImage.username = username
        newUploadImage.path = result.Location
        newUploadImage.private = false
        newUploadImage.save((err) => {
          if (err) {
            console.log(err)
            res.end('error')
          } else {
            success()
          }
        })
      }
    }
  )

}

module.exports = router