const config = process.env.NODE_ENV === 'development' ? {
    mongo: 'mongodb://localhost:27017/portfolio',
} : {
    mongo: 'mongodb://heroku_lm021t53:oces68i8q3l2k1ks58qdaac9i1@ds157539.mlab.com:57539/heroku_lm021t53',
}

module.exports = config