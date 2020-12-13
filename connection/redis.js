var redis = require('redis');
var redisClient = redis.createClient({
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});
redisClient.on('connect', function() {
    console.log('Redis Database connected');
});

redisClient.on("error", function(error) {
    console.error("Redis Database",error);
  });

module.exports = redisClient