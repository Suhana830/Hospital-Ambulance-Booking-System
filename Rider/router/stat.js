const express = require("express");
const { CreateUser, loginUser } = require("../controllers/user")
const User = require("../models/user.js")


const router = express.Router();

router.get("/", async (req, res) => {


    //ambulance & hospital show
    return res.render('findHosp');
})

router.get("/get-Ambulance", (req, res) => {
    return res.render('findAmb')
})
router.get("/signUp", (req, res) => {
    return res.render("SignUp")
})

router.get("/login", (req, res) => {
    return res.render("signIn")
})

router.post("/signUp", CreateUser)

router.post("/login", loginUser);

router.get("/logOut", (req, res) => {

    res.clearCookie("token").redirect("/Rider");
})



module.exports = router;