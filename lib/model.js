var mongoose = require('mongoose');
var config = require('./config');
var url = config.mongo;
var db = mongoose.createConnection(url, function(err, res) {
    if (err) {
        console.log('Error connected: ' + url + ' - ' + err);
    } else {
        console.log('Success connected: ' + url);
    }
});

// Modelの定義
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
}, { collection: 'users' });

exports.User = db.model('User', UserSchema);