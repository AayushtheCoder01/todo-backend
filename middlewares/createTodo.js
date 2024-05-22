const jwt = require("jsonwebtoken")
const { createTodo } = require("../validation")
const jwtKey = "key.jwt"

function validateTodo(req, res, next) {
    const parsedData = createTodo.safeParse({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || "other"
    })
    const authtoken = req.headers.authorization
    
    try {
        const verify = jwt.verify(authtoken, jwtKey)

        if(verify) {
            if (parsedData.success) {
            req.userTodo = parsedData
            req.userId = verify.username
            next()
        }
        }
    } catch (error) {
        res.status(400).json({
            msg: "something went wrong"
        })
    }
}

module.exports = validateTodo