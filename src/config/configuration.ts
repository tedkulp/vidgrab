export default () => ({
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT, 10) || 6379,
  fileDir: process.env.FILE_DIR || '/tmp',
});
