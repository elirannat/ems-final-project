const mongoose = require('mongoose');
const OauthClient = require('../../model/OauthClient');
const Company = require('../../model/Company');
const TokenModel = require('../../model/Token');
const CONSTANTS = require('../../config/constants');
var crypto = require("crypto");

exports.createClient = (clientId, clientSecret, cbFunc) => {

    const oauthClient = new OauthClient({
        _id: new mongoose.Types.ObjectId(),
        id: clientId,
        clientId: clientId,
        clientSecret: clientSecret,
        grants: ['password', 'refresh_token'],
        userId: "6221ce725f6ab877a57a135a"
    });

    oauthClient.save()
        .then(clients => {
            console.log(clients);
            return clients;
        })
        .catch(err => {
            console.log(err);
            console.log(err);
        });
}

exports.getClient = (clientId, clientSecret, cbFunc) => {
    OauthClient.find({ clientId: clientId, clientSecret: clientSecret })
        .exec()
        .then(clients => {
            if (clients.length > 0) {
                cbFunc(false, clients[0]);
            } else {
                cbFunc('Invalid Clients Credentials');
            }
        })
        .catch(err => {
            console.log(err);
            cbFunc('Something Went Wrong');
        });
}

exports.login = (email, password, cbFunc) => {
    if (email && password) {
        Company.find({ email: email })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    var shaPass = crypto.createHash("sha256").update(password).digest("hex");

                    Company.find({ email: email, password: shaPass })
                        .exec()
                        .then(user => {
                            if (user.length > 0) {
                                cbFunc(false, user[0]);
                            } else {
                                cbFunc('Email or Password Incorrect');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            cbFunc('Something Went Wrong');
                        });

                } else {
                    cbFunc('Email Does Not Exist');
                }
            })
            .catch(err => {
                console.log(err);
                cbFunc('Something Went Wrong');
            });
    } else {
        cbFunc("Invalid Post Parameter");
    }
}

exports.saveToken = (token, clientId, userId, cbFunc) => {

    const tokenModel = new TokenModel({
        _id: new mongoose.Types.ObjectId(),
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        clientId: clientId,
        userId: userId,
        status: 'active'
    });

    tokenModel.save()
        .then(t => {
            cbFunc(false, token);
        })
        .catch(err => {
            console.log(err);
            cbFunc('Something Went Wrong');
        });
}

exports.getUserIDFromBearerToken = (accessToken, cbFunc) => {
    TokenModel.find({ accessToken: accessToken })
        .exec()
        .then(token => {
            if (token.length > 0) {
                cbFunc(true, token[0]);
            } else {
                cbFunc(false, 'Invalid Access Token');
            }
        })
        .catch(err => {
            console.log(err);
            cbFunc(false, 'Something Went Wrong');
        });
}

exports.getUserIDFromRefreshToken = (refreshToken, cbFunc) => {
    TokenModel.find({ refreshToken: refreshToken })
        .exec()
        .then(token => {
            if (token.length > 0) {
                cbFunc(token[0]);
            } else {
                cbFunc('Invalid Refresh Token');
            }
        })
        .catch(err => {
            console.log(err);
            cbFunc('Something Went Wrong');
        });
}

exports.deleteRefreshToken = (refreshToken, cbFunc) => {
    TokenModel.updateOne({ refreshToken: refreshToken }, { $set: { status: CONSTANTS.STATUS.EXPIRED } })
        .exec()
        .then(token => {
            cbFunc(token.nModified);
        })
        .catch(err => {
            console.log(err);
            cbFunc('Something Went Wrong');
        });
}
