const JWT = require("jsonwebtoken")

const secret = "suhana@1230"

CreateTokenForUser = async (user) => {


    const payload = {
        name: user.Name,
        email: user.email,
        _id: user._id,
        profileImage: user.profileUrl,
        role: user.role
    };

    const token = await JWT.sign(payload, secret);

    return token
}

function validateToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    }
    catch {
        return null
    }
}

module.exports = {
    CreateTokenForUser,
    validateToken
}