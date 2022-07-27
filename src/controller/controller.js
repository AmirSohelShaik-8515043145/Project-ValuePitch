const userModel = require("../model/model")
const aws = require("../aws/aws")


const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value).trim().length == 0) { return false }
    if (typeof (value) === "string" && (value).trim().length > 0) { return true }
}

const getAge = (dateString) => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const createUser = async function (req, res) {
    try {
        let data = req.body
        
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "BAD REQUEST NO DATA PROVIDED" })
        const { name, email, password, dob, country,address } = data

        if (!isValid(name)) { return res.status(400).send({ status: false, msg: "First name is required" }) }
        if (!isValid(email)) { return res.status(400).send({ status: false, msg: "email is required" }) }
        if (!isValid(dob)) { return res.status(400).send({ status: false, msg: "dob is required" }) }
        if (!isValid(country)) { return res.status(400).semd({ status: false, msg: "country is required" }) }
        if (!isValid(password)) { return res.status(400).send({ status: false, msg: "Password is required" }) }


        let files = req.files;
        if (Object.keys(files).length == 0) { return res.status(400).send({ status: false, msg: "Avatar is required" }) }
        const fileRes = await aws.uploadFile(files[0]);
        let avatar = fileRes.Location;

        let age = getAge(dob)
        let userData = {
            name: name,
            email: email,
            password: password,
            age: age,
            avatar: avatar,
            country: country,
            address : address
        }
        console.log(userData)
        let savedData = await userModel.create(userData)
        return res.status(201).send({ msg: savedData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}



const getUserProfile = async (req, res) => {
    try {
        let userId = req.params.id;

        let user = await userModel.findById(userId).select({country:0});
        if (!user) return res.status(404).send({ status: false, message: "No user found according to your search" })
        return res.status(200).send({ status: true, message: "User Profile Details", data: user });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = {
    createUser,
    getUserProfile
}

