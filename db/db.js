const mongoose = require("mongoose");
const { array } = require("zod");

mongoose.connect('mongodb+srv://aayushkr:1234@cluster0.gx4bz1m.mongodb.net/todos')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    userTodos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "todos"
    },
    usercategory: {
        type: [String],
        default: "coding", 
    },
    userCreatedAt: {
        type: String,
        default: () => {
            const date = new Date();
            const time = date.getTime();
            String(time)
            console.log(time);
            return time
        }
    }
})

const userTodoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: () => {
            const date = new Date();
            const time = date.getTime();
            String(time)
            return time
        }
    },
    category: {
        type: String,
        default: "coding",
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const userDb = mongoose.model("users", userSchema)

const userTodoDb = mongoose.model("todos", userTodoSchema)

module.exports = {
    userDb: userDb,
    userTodoDb: userTodoDb
}