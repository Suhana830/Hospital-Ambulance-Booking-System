const User = require("../models/user");
const { CreateTokenForUser, validateToken } = require("../services/authentication")
const { createHmac } = require('node:crypto');

exports.CreateUser = async (req, res) => {

    const { name, email, password, status, ambulanceN } = req.body;
    const newUser = new User({
        name: name,
        email: email,
        password: password,
        status: status,
        ambulanceN: ambulanceN
    });

    const savedUser = await newUser.save();

    return res.render('signIn');
}


async function MatchPasswordANDcreateToken(email, password) {


    const user = await User.findOne({ email: email });
    if (user) {
        console.log('User found:', user);
    } else {
        console.log('No user found with that email');
        return null
    }


    console.log(user);
    const salt = user.salt;
    const hashedpasswod = user.password;

    const hash1 = createHmac('sha256', salt).update(password).digest("hex");



    if (hash1 === hashedpasswod) {
        const token = await CreateTokenForUser(user);
        // console.log(token);
        return token
    }


    return null;



}
exports.loginUser = async (req, res) => {

    const { email, password } = req.body;


    try {
        const Token = await MatchPasswordANDcreateToken(email, password);
        console.log("Driver token", Token)

        return res.cookie("Drivertoken", Token).redirect("/home");

    } catch (error) {
        return res.send({ error: "Incorrect password and email" });
    }


}