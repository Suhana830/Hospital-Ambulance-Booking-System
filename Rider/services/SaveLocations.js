const JWT = require("jsonwebtoken")

const secret = "suhana@1230"

CreateSourceLocation = async (data) => {


    const payload = {
        latitude: data.Latitude,
        longitude: data.Longitude,
        speciality: data.speciality
    };

    const token = await JWT.sign(payload, secret);

    return token
}

CreateDestinationLocation = async (data) => {


    const payload = {
        latitude: data.latitude,
        longitude: data.longitude,
        hospital_name: data.hospital,

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
    CreateSourceLocation,
    CreateDestinationLocation,
    validateToken
}