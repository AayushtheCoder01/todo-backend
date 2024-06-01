const zod = require("zod")

const createTodo = zod.object({
    title : zod.string().min(1),
    description : zod.string().min(0),
    category : zod.string().min(0)
})

const deleteTodo = zod.object({
    todoId: zod.string()
})

const updateTodo = zod.object({
    title: zod.string(),
    description: zod.string(),
    category : zod.string().min(0),
    completed : zod.boolean(),
    todoId: zod.string()
})  

const createUser = zod.object({
    username: zod.string().min(5),
    password: zod.string().min(2)
})

module.exports= {
    createTodo: createTodo,
    updateTodo: updateTodo,
    createUser: createUser,
    deleteTodo: deleteTodo,
}