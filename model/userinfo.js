const mongoose = require('mongoose')
const crypto = require('crypto')
const config = require('../config')

const User = mongoose.model('MyUsers', {
    name: String,
    password: String,
    admin: { type: Boolean, default: false }
});

User.createUser = function (name, password, admin) {
    console.log(name + " " + password + " " + admin);
    return new Promise(function (resolve, reject) {
        const user = new User({
            name: name,
            password: crypto.createHmac('sha1', config.secret).update(password).digest('base64'),
            admin: false
        });
        User.findOneAndUpdate(
            { name: name },
            { $setOnInsert: user },
            { upsert: true, new: true },
            function (err, doc) {
                if (err) {
                    reject({ success: false, message: err });
                    return;
                }
                resolve({ success: true, message: doc });
                return;
            });
    });
}

User.deleteUser = function (name) {
    return new Promise(function (resolve, reject) {
        User.findOneAndRemove({ name: name }, function (err, doc) {
            if (err) {
                reject({ success: false, message: err });
                return;
            }
            if (!doc) {
                reject({ success: false, message: "User not found." });
                return;
            }
            resolve({ success: true, message: doc });
            return;
        });
    });
}

User.updateUser = function (name, password, admin) {
    return new Promise(function (resolve, reject) {
        const encrypted = crypto.createHmac('sha1', config.secret).update(password).digest('base64')
        User.findOneAndUpdate(
            { name: name },
            { $set: { password: encrypted, admin: Boolean(admin) } },
            function (err, doc, res) {
                if (err) {
                    reject({ success: false, message: err });
                    return;
                }
                if (!doc) {
                    reject({ success: false, message: "User not found." });
                    return;
                }
                resolve({ success: true, message: doc, detail: res });
                return;
            });
    });
}

User.findUser = function (name) {
    return new Promise((resolve, reject) => {
        User.findOne({ name: name }, function (err, doc) {
            if (err) {
                reject({ success: false, message: err });
                return;
            }
            if (!doc) {
                reject({ success: false, message: "User not found." });
                return;
            }
            resolve({ success: true, message: doc });
            return;
        });
    });
}

User.verifyUser = function (name, password) {
    return new Promise(function (resolve, reject) {
        const encrypted = crypto.createHmac('sha1', config.secret).update(password).digest('base64')

        User.findOne({ name: name }, function (err, doc) {
            if (err) {
                reject({ success: false, message: err });
                return;
            }
            if (!doc) {
                reject({ success: false, message: "Invalid user and/or password." });
                return;
            }
            if (encrypted !== doc.password) {
                reject({ success: false, message: "Invalid user and/or password." });
                return;
            }
            resolve({ success: true, message: { name: doc.name, admin: doc.admin } });
        });
    });
}

module.exports = User;
