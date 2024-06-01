const { createUser } = require("../validation")

function validateUser(req, res, next) {
    const parsedData = createUser.safeParse({
        username: req.body.username,
        password: req.body.password
    })
    console.log(parsedData)

    if (parsedData.success) {
        req.userData = parsedData
        next()
    } else {
        res.status(400).json({
            msg: "Email or password must be greater than 5"
        })
    }
}

module.exports = validateUser