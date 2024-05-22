const express = require("express")
const jwt = require("jsonwebtoken")
const jwtKey = "key.jwt"
const cors = require("cors")
const userAuth = require("./middlewares/auth")
const validateUser = require("./middlewares/createUser")
const validateTodo = require("./middlewares/createTodo")
const {userDb, userTodoDb} = require("./db/db")
const todoUpdateValidation = require("./middlewares/updateTodo")
const deleteTodoValidation = require("./middlewares/deleteValidation")
const port = process.env.PORT
 
const app = express()
app.use(express.json())
app.use(cors())

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Bad JSON" });
    }
    next();
});

app.get('/', userAuth, async(req, res) =>{
    const userData = req.userData

    const userTodos = await userTodoDb.find({
        _id: {
            "$in" : userData.userTodos
        }
    }) 
    res.json({
        msg: "hello from backend.",
        login: true,
        userData: userData,
        userTodos: userTodos
    })
})

app.get('/todos', userAuth, async(req, res) =>{
    const userData = req.userData
    const userTodos = await userTodoDb.find({
        _id: {
            "$in" : userData.userTodos
        }
    }) 
    res.json({
        msg: "todo fetched successfully.",
        userTodos: userTodos
    })
})
0
app.post("/login", validateUser, async (req, res) => {
    const userData = req.userData.data
    try {
        const user = await userDb.findOne({username: userData.username, password: userData.password})
        console.log(user)
        if (user === null) throw err
        const authtoken = jwt.sign({username: user.username, password: user.password}, jwtKey, {expiresIn: "24h"} )

        res.status(200).json({
        msg: "login successful",
        login: true,
        userData: user,
        authorization: authtoken,
    })
    } catch (error) {
        res.status(400).json({
            msg: "wrong credentials",
            login: false,
        })
    }
})

app.post("/signup", validateUser, (req, res) => {
    const userData = req.userData.data

    const authtoken = jwt.sign(userData, jwtKey, {expiresIn: "7d"})
     userDb.create({
        username: userData.username,
        password: userData.password
    }).then((res) => {
        console.log("user created successfully.")
    })
    res.json({
        msg: "signup successful",
        authorization: authtoken
    }).status(200)
    
})

app.post("/createtodo", validateTodo, async (req, res) => {
    const userId = req.userId
    const userTodo = req.userTodo
    
    try {
        const todoCreate = await userTodoDb.create({
            title: userTodo.data.title,
            description: userTodo.data.description,
            category: userTodo.data.category
        })
    
        const user = await userDb.findOne({username: userId})
        user.userTodos.push(todoCreate._id)
        user.save()
    
        res.status(200).json({
            msg: "todo created",
            todoId: todoCreate._id,
        })
    } catch (error) {
        res.status(400).json({
            msg: "request failed",
        })
    }
    
})

app.put("/updatetodo", todoUpdateValidation, async (req, res) => {
    const newTodo = req.todo.data
    const todoId = req.todoId

    try {
        const todo = await userTodoDb.findOne({_id: todoId})
        todo.title = newTodo.title
        todo.description = newTodo.description
        todo.category = newTodo.category
        todo.completed = newTodo.completed
        todo.save() 

        res.status(200).json({
            msg: "todo updated successfully.",
            updatedTodo: todo
        })
    } catch (error) {
        res.status(400).json({
            msg: "wrong todo id"
        })
    }
})

app.delete("/deletetodo", deleteTodoValidation, async (req, res) => {
    const todoId = req.todoId
    const username = req.username
    try {
        await userTodoDb.findByIdAndDelete({_id: todoId})

        const updateTodoIdArr = await userDb.findOneAndUpdate(
            {username: username},
            {
                "$pull": {
                    userTodos: todoId
                }
            },
            {new: true}
        )

        res.status(200).json({
            msg: "todo deleted."
        })

    } catch (error) {
        res.status(400).json({
            msg: "request failed"
        })
    }
    
})

app.listen(3000,() => {
    console.log("server started.")
})