const JWT = require("jsonwebtoken")

const secret = "suhana@1230"

CreateTokenForUser = async (user) => {

    console.log("--->", user);
    const payload = {

        email: user.email,
        id: user._id,
        status: user.status,
        AmbulanceN: user.ambulanceN
    };

    console.log("payload", payload)


    const token = await JWT.sign(payload, secret);

    return token
}

function validateToken(token) {

    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    CreateTokenForUser,
    validateToken
}