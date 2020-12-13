module.exports = {
	PORT: (process.env.DEV_PORT || 5000),
	DATABASE_URL: process.env.POSTGRESQL_DATABASE_URL,
  SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: (process.env.JWT_EXPIRATION || 86400),
  SALT_ROUNDS : 10
};