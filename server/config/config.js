const env = process.env.NODE_ENV || 'development';
console.log(`*** Running on ${env} mode ***`);

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/todo';
} else if (env === 'test') {
  process.env.PORT = 3001;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/todotest';
}
