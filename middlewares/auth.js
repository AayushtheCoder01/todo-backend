const jwt = require('jsonwebtoken')
const { userDb } = require('../db/db')
const jwtKey = "key.jwt"

async function userAuth(req, res, next) {
    const authtoken =  req.headers.authorization
    try {
        const verify = jwt.verify(authtoken, jwtKey)
        
        const user = await userDb.findOne({username: verify.username})
        if(user === null) throw err
        if (verify.username == user.username) {
            req.userData = user
            next()
        }
    } catch (error) {
        res.json({
            msg: "auth not verified", 
            login: false,
        }).status(400)
    }
    
}

module.exports = userAuth