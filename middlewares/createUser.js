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
            msg: "wrong inputs"
        })
    }
}

module.exports = validateUser