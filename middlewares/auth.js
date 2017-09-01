const jwt = require('jsonwebtoken');

console.log("Create Authentication Module");
exports
var authModule = new Object(
    {
        key: "0",
        verifyToken: function (req, res, next) {
            // Read token
            const token = req.headers['x-access-token'] || req.query.token;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
                return;
            }

            // create a promise that decodes the token
            new Promise(function (resolve, reject) {
                jwt.verify(token, authModule.key, function (err, verifiedToken) {
                    if (err) {
                        reject({
                            success: false,
                            message: "Forbidden"
                        });
                        return;
                    }
                    else {
                        resolve(verifiedToken);
                        return;
                    }
                });
            }).then(function (verifiedToken) {
                req.verifiedToken = verifiedToken;
                next();
                return;
            }).catch(function (err) {
                res.status(403).json(err);
                return;
            });
        },
        issueToken: function (req, res, next) {
            if (req.jwtToken === "undefined") {
                res.status(500).json({
                    success: false,
                    message: "Internal server error. jwt_token is undefined."
                });
                return;
            }
            if (req.jwtOption === "undefined") {
                res.status(500).json({
                    success: false,
                    message: "Internal server error. jwt_option is undefined."
                });
                return;
            }
            jwt.sign(req.jwtToken, authModule.key, req.jwtOption, function (err, token) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: token
                });
                return;
            });
        }
    }
);

module.exports = authModule;
