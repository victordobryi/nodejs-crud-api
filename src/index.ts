import http from 'http';
import 'dotenv/config';

const PORT = process.env.PORT;

const myServer = http.createServer((req, res) => {
  res.write('Hello World!');
  res.end();
});

myServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`);
});
