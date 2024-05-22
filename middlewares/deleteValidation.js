const jwt = require("jsonwebtoken")
const jwtKey = "key.jwt"
const {deleteTodo} = require("../validation")

function deleteTodoValidation(req, res, next) {
    const authtoken = req.headers.authorization
    try {
        const verify = jwt.verify(authtoken, jwtKey)
        if(verify) {
            const parsedData = deleteTodo.safeParse({
                todoId : req.body.todoId
            })
            if (!parsedData.success) throw err
            req.todoId = parsedData.data.todoId
            req.username = verify.username
            next()
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

module.exports = deleteTodoValidation