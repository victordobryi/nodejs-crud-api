import http from 'http';
import 'dotenv/config';
import { userRouter } from './user/user.router';
import { appRouter } from './app.router';
import { Routes } from './types/request.interface';

/* TODO:
  1) create 2 modes of running app (development (start:dev) and production (start:prod))
  2) install jest. add this test scenarios:
    a) Get all records with a GET api/users request (an empty array is expected)
    b) A new object is created by a POST api/users request (a response containing newly created record is expected)
    c) With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)
    d) We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
    e) With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
    f) With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
  3) Requests to non-existing endpoints (e.g. some-non/existing/resource) should be handled (server should answer with status code 404 and corresponding human-friendly message)
  4) Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with status code 500 and corresponding human-friendly message)
    */

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.url?.startsWith(Routes.USERS)) {
    userRouter(req, res);
  } else {
    appRouter(req, res);
  }
});

server.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`)
);
