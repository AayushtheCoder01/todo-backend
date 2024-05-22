const zod = require("zod")

const createTodo = zod.object({
    title : zod.string().min(1),
    description : zod.string().min(0),
    category : zod.string().min(0)
})

const updateTodo = zod.object({
    title: zod.string().min(1),
    description: zod.string().min(1)
})  

const createUser = zod.object({
    username: zod.string().min(4),
    password: zod.string()
    .min(4, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be no more than 100 characters long" })
})

module.exports= {
    createTodo: createTodo,
    updateTodo: updateTodo,
    createUser: createUser
}