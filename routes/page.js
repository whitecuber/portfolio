var express = require('express')
var router = express.Router()

var fs = require('fs')
var aws = require('aws-sdk')

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME

aws.config.update({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY
})

var s3 = new aws.S3()

router.get('/', function(req, res, next) {
    res.render('page', { title: 'Page' })
})
router.post('/', function(req, res, next) {
    var buffer = fs.readFileSync(req.file.path)
    s3.upload({
            Bucket: S3_BUCKET_NAME,
            Key: req.file.filename,
            Body: buffer,
        },
        (error, result) => {
            if (error) {
                console.log(error)
                res.end('error')
            } else {
                res.end(`<html><body><img src=${result.Location}></body></html>`)
            }
        }
    )
})

module.exports = router;