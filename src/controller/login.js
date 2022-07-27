const jwt = require("jsonwebtoken")
const userModel = require("../model/model")

const login = async function (req, res) {
    try {
        const data = req.body

        let user = await userModel.findOne({email:data.email})
        if(!user) {return res.status(400).send({ status: false, msg: "Email or Password is incorrect" })}

        const token = jwt.sign({
            userId: user._id,
        }, "abc", {expiresIn: "120m"})
        // res.setHeader("x-api-key",token);
        return res.status(200).send({ status: true, msg: "You are successfully logged in", userId:user.id,token })
    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

module.exports.login = login