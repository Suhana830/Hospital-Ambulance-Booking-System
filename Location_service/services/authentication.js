const JWT = require("jsonwebtoken")

const secret = "suhana@1230"

CreateTokenForUser = async (user) => {


    const payload = {
        Name: user.Name,
        email: user.email,
        id: user._id,
        status: user.status,
        AmbulanceN: user.AmbulanceN
    };


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