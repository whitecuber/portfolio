var sechash = require('sechash');

var options = {
    algorithm: 'sha512',
    iterations: 2134, // 繰り返し回数
    salt: 'abarancho'
};

var password = {
    createHash: function(password) {
        return sechash.strongHashSync(password, options);
    },
    check: function(password, hash) {
        return sechash.testHashSync(password, hash, options);
    }
};

module.exports = password;