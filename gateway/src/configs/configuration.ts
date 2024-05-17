import { env } from 'process';

export default () => ({
  app: {
    prefix: env.APP_PREFIX,
  },
  host: {
    url: env.HOST_URL,
    port: +env.HOST_PORT,
  },
  database: {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT, 10),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    schema: env.DB_SCHEMA,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtIssuer: env.JWT_ISSUER,
  },
});
