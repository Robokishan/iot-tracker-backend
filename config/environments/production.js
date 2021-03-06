module.exports = {
	PORT: (process.env.PRODUCTION_PORT || 80),
	DATABASE_URL: process.env.POSTGRESQL_DATABASE_URL,
  SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: (process.env.JWT_EXPIRATION || 86400),
  SALT_ROUNDS : 10
};