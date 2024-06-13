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
const addCategory = require("./middlewares/addCategory")
const sendnMail = require("./middlewares/signupMail")
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

app.get('/sessionsignin', userAuth, async(req, res) =>{
    const userData = req.userData

    // const userTodos = await userTodoDb.find({
    //     _id: {
    //         "$in" : userData.userTodos
    //     }
    // }) 

    res.json({
        msg: "session login successful.",
        login: true,
        userData: userData,
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
        status: 200,
        userTodos: userTodos
    })
})


app.post("/login", validateUser, async (req, res) => {
    const userData = req.userData.data
    try {
        const user = await userDb.findOne({username: userData.username, password: userData.password})
        console.log(user)
        if (user === null) throw err
        const authtoken = jwt.sign({username: user.username, password: user.password}, jwtKey, {expiresIn: "10d"} )

        res.status(200).json({
        msg: "login successful",
        login: true,
        userData: user,
        authorization: authtoken,
    })
    } catch (error) {
        res.status(400).json({
            msg: "invalid credentials",
            login: false,
        })
    }
})

app.post("/signup", validateUser, sendnMail, async(req, res) => {
    const userData = req.userData.data
    const isExixt = await userDb.findOne({username: userData.username})

    if(isExixt === null) {
        const authtoken = jwt.sign(userData, jwtKey, {expiresIn: "10d"})
        const createUser = await userDb.create({
           username: userData.username,
           password: userData.password
       })
       const user = await userDb.findOne({username: userData.username})
       res.json({
           msg: "signup successful",
           signup: true,
           userData: user,
           authorization: authtoken
       }).status(200) 
    } else {
        res.json({
            signup: false,
            msg: "Email already exist.",
    }).status(400)
}
    
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
            status: true,
            todoId: todoCreate._id,
        })
    } catch (error) {
        res.status(400).json({
            status: false,
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
            status: true,
            msg: "todo updated successfully.",
            updatedTodo: todo
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            msg: "todo not updated."
        })
    }
})

app.post("/deletetodo", deleteTodoValidation, async (req, res) => {
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
            status: true,
            msg: "todo deleted."
        })

    } catch (error) {
        res.status(400).json({
            status: false,
            msg: "request failed"
        })
    }
    
})

app.post("/addcategory", addCategory, async (req, res) => {
    try {
        const username = req.username

    const newCategory = req.body.newcategory

    const updateUser = await userDb.findOne({username: username})

    updateUser.usercategory.push(newCategory)
    updateUser.save()

    res.status(200).json({
        msg: "New category added",
        status: true,
    })
    } catch (error) {
        res.status(400).json({
            msg: "request failed",
            status: false,
        })
    }
    
})

app.listen(3000,() => {
    console.log("server started.")
})