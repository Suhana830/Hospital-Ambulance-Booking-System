const express = require("express");
const { CreateTokenForUser, validateToken } = require('../services/authentication.js')
// const { driver } = require("../model/driver_schema.js")
const router = express.Router();
const User = require('../models/user.js');
const { CreateUser, loginUser } = require("../controllers/user.js");




router.get("/home", async (req, res) => {
    return res.render('Driver_Home.ejs')
})

router.post("/connections", async (req, res) => {

    // const { value } = req.body;
    // console.log(value)
    console.log("hello")
    const TokenCookieValue = req.cookies['Drivertoken'];
    const decode = validateToken(TokenCookieValue);

    // if (value == 'available') {



    const result = await User.updateOne(
        { _id: decode.id }, // Filter to identify the user
        { $set: { status: "available" } } // Field to update
    );

    console.log(result);

    const userId = decode.id

    console.log(userId);
    console.log("decode ", decode)

    // return res.redirect(`http://localhost:8000/location?userId=${userId}`);
    // }
    return res.redirect(`http://127.0.0.1:3000?userId=${userId}&AmbN=${decode.AmbulanceN}`);

})

router.get('/get-info', (req, res) => {
    res.json({ info: req.session.info });
});

router.get('/signUp', (req, res) => {
    res.render('signUp');
}
)


router.get('/signIn', (req, res) => {
    res.render('signIn');
}
)


router.post("/signup",

    CreateUser
);

router.post("/login",
    loginUser
);


module.exports = router;


// mongodb+srv://suhanagupta809036:<XRqNUwIajT5Eb58T>@cluster0.xnlfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"