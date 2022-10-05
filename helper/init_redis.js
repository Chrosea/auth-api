const redis = require('redis');

let redisClient = redis.createClient();
(async () => {
    redisClient.on("error", (error) => {
    console.log(error);
    });
    redisClient.on("connect", () => {
    console.log("Redis connected!");
    });

    await redisClient.connect();
})();

module.exports = redisClient;