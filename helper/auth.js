const jwt = require('jsonwebtoken');
const TOKEN_EXPIRE = '2h'

const verifyToken = async (accessToken) => {
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    if ((exp < Date.now().valueOf() / 1000)) {
        return res.status(401).json({
            error: "JWT token has expired, please re-login"
        })
    }
    return userId;
}

const createToken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRE
    });
}

module.exports = {verifyToken, createToken};