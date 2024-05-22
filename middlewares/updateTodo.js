
const { updateTodo } = require("../validation")
const jwt = require("jsonwebtoken")
const jwtKey = "key.jwt"


function todoUpdateValidation(req, res, next) {
    const authtoken = req.headers.authorization
  
    try {
        const verify = jwt.verify(authtoken, jwtKey)
        if(verify) {
            const parsedData = updateTodo.safeParse({
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                completed: req.body.completed,
                todoId: req.body.todoId
            })
            if (!parsedData.success) throw err
            req.todo = parsedData
            req.todoId = parsedData.data.todoId
            next()
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

module.exports = todoUpdateValidation