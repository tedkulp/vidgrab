export default () => ({
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379,
  fileDir: process.env.FILE_DIR || '/tmp',
  siteUrl: process.env.SITE_URL || 'http://localhost:4200',
});
