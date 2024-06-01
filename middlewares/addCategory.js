const jwt = require('jsonwebtoken')
const { userDb } = require('../db/db')
const jwtKey = "key.jwt"

async function addCategory(req, res, next) {
    const authtoken =  req.headers.authorization
    try {
        const verify = jwt.verify(authtoken, jwtKey)
        if (verify.username) {
            req.username = verify.username
            next()
        }
    } catch (error) {
        res.json({
            msg: "auth not verified", 
            status: false,
        }).status(400)
    }
    
}

module.exports = addCategory