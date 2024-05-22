const express = require("express")
const jwt = require("jsonwebtoken")
const jwtKey = "key.jwt"
const cors = require("cors")
const userAuth = require("./middlewares/auth")
const validateUser = require("./middlewares/createUser")
const validateTodo = require("./middlewares/createTodo")
const {userDb, userTodoDb} = require("./db/db")
const port = process.env.PORT
 
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', userAuth, (req, res) =>{
    const userData = req.userData
    res.json({
        msg: "hello from backend.",
        login: true,
        userData: userData,
    })
})

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

app.put("/")

app.listen(3000,() => {
    console.log("server started.")
})