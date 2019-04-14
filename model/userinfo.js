const mongoose = require('mongoose')
const crypto = require('crypto')
const config = require('../config')

const User = mongoose.model('CafeBlancCustomers', {
    phone: String,
    password: String, 
    cumulative_points: { type: Number, default: 0 },
    available_points: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    admin: { type: Boolean, default: false }
});

/* This function is only called by local. This should not be exposed to external access. */
User.createAdminUser = function () {
    return new Promise(function (resolve, reject) {
        const user = new User({
            phone: config.admin_phone,
            password: crypto.createHmac('sha1', config.secret).update(config.admin_password).digest('base64'),
            cumulative_points: 0,
            available_points: 0,
            visit_count: 0,
            level: 0,
            admin: true
        });
        User.findOneAndUpdate(
            { phone: user.phone },
            { $setOnInsert: user },
            { upsert: true, new: true },
            function (err, doc) {
                if (err) {
                    return;
                }
                return;
            });
    });
}


User.createCustomerUser = function (phone, cumulative_points, available_points, visit_count, level) {
    return new Promise(function (resolve, reject) {
        const user = new User({
            phone: phone,
            password: crypto.createHmac('sha1', config.secret).update(phone).digest('base64'),
            cumulative_points: cumulative_points,
            available_points: available_points,
            visit_count: visit_count,
            level: level,
            admin: false
        });
        User.findOneAndUpdate(
            { phone: user.phone },
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

User.deleteUser = function (phone) {
    return new Promise(function (resolve, reject) {
        User.findOneAndRemove({ phone: phone }, function (err, doc) {
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

User.updateUser = function (phone, cumulative_points, available_points, visit_count, level) {
    return new Promise(function (resolve, reject) {
        const encrypted = crypto.createHmac('sha1', config.secret).update(phone).digest('base64')
        User.findOneAndUpdate(
            { phone: phone },
            { $set: { cumulative_points: cumulative_points, available_points: available_points, visit_count: visit_count, level: level } },
            { new : true }, 
            function (err, doc, res) {
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

User.findUser = function (phone) {
    return new Promise((resolve, reject) => {
        User.findOne({ phone: phone }, function (err, doc) {
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

User.verifyUser = function (phone, password) {
    return new Promise(function (resolve, reject) {
        const encrypted = crypto.createHmac('sha1', config.secret).update(password).digest('base64')

        User.findOne({ phone: phone }, function (err, doc) {
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
            resolve({ success: true, message: { phone: doc.phone, admin: doc.admin } });
        });
    });
}

module.exports = User;
