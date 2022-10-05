const jwt = require('jsonwebtoken');
const redisClient = require('./init_redis');

const verifyToken = async (accessToken, res) => {
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    const inDenyList = await redisClient.get(`bl_${accessToken}`);
    if ((exp < Date.now().valueOf() / 1000)) {
        return res.status(401).json({
            error: "JWT token has expired, please re-login"
        })
    }

    if (inDenyList) {
        return res.status(401).send({
            message: "JWT Rejected",
        });
    }
    return userId;
}

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE
    });
}

module.exports = { verifyToken, createToken };