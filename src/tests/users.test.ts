import request from 'supertest';
import { User, UserErrors } from '../user/user.interface';
import { userData } from '../constants/testTypes';
import { createServer } from '../server';

const server = createServer();

describe('1st scenario', () => {
  let createdUser: User;
  afterAll(() => server.close());
  test('should return a list of users with a GET api/users', async () => {
    const req = await request(server).get('/api/users');
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
    expect(req.body).toEqual([]);
  });
  test('should create a new user, and return it with a POST api/users', async () => {
    const req = await request(server).post('/api/users').send(userData);
    expect(req.status).toBe(201);
    expect(req.body).toEqual(expect.objectContaining(userData));
    expect(req.body).toHaveProperty('id');
    createdUser = req.body;
  });
  test('should return a user with a GET api/users/{userId}', async () => {
    const req = await request(server).get(`/api/users/${createdUser.id}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expect.objectContaining(userData));
    expect(req.body).toHaveProperty('id');
  });
  test('should update a user with a PUT api/users/{userId}', async () => {
    const updatedUser = { ...createdUser, username: 'Piter' };
    const req = await request(server).put(`/api/users/${createdUser.id}`).send(updatedUser);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(updatedUser);
    expect(req.body).not.toEqual(createdUser);
    expect(req.body).toHaveProperty('id');
  });
  test('should delete a user with a DELETE api/users/{userId}', async () => {
    const req = await request(server).delete(`/api/users/${createdUser.id}`);
    expect(req.status).toBe(204);
  });
  test('should return null if get a user after delete it with a GET api/users/{userId}', async () => {
    const userReq = await request(server).get(`/api/users/${createdUser.id}`);
    expect(userReq.status).toEqual(404);
    expect(userReq.body.message).toEqual(`Not Found : ${UserErrors.USER_NOT_FOUND}`);
  });
});

describe('2nd scenario', () => {
  test('should return not found message if invalid url', async () => {
    const req = await request(server).get('/api/person');
    expect(req.status).toBe(404);
    expect(req.body.message).toEqual(
      'Not Found : Sorry, the page you are looking for does not exist.'
    );
  });
  test('should return invalid message if not valid userId', async () => {
    const req = await request(server).get('/api/users/1');
    expect(req.status).toBe(400);
    expect(req.body.message).toEqual(`Bad Request : ${UserErrors.NOT_VALID_ID}`);
  });
  test('should return not found message if non-existent uuid', async () => {
    const req = await request(server).get('/api/users/3d2dc3c2-8c78-4fea-85f0-24f064327a92');
    expect(req.status).toBe(404);
    expect(req.body.message).toEqual(`Not Found : ${UserErrors.USER_NOT_FOUND}`);
  });
  test('should return error if not valid data to create user', async () => {
    const req = await request(server).post('/api/users').send({
      param: 'not valid data',
    });
    expect(req.status).toBe(400);
    expect(req.body.message).toEqual(`Bad Request : ${UserErrors.NOT_VALID_BODY}`);
  });
  test('should return error if no id to delete a user', async () => {
    const req = await request(server).delete(`/api/users/`);
    expect(req.status).toBe(400);
    expect(req.body.message).toEqual(`Bad Request : ${UserErrors.NOT_VALID_ID}`);
  });
  test('should return hello world message', async () => {
    const req = await request(server).get('');
    expect(req.status).toBe(200);
    expect(req.body).toEqual('Hello world');
  });
});

describe('3rd scenario', () => {
  let createdUser: User;
  afterAll(() => server.close());

  test('should return an error if the user name type is incorrect ', async () => {
    const req = await request(server).post('/api/users').send(userData);
    expect(req.status).toBe(201);
    createdUser = req.body;
    const updateReq = await request(server)
      .put(`/api/users/${createdUser.id}`)
      .send({ username: 1 });
    expect(updateReq.status).toBe(400);
    expect(updateReq.body.message).toEqual(`Bad Request : ${UserErrors.NOT_VALID_BODY}`);
  });

  test('should return an error if the age type is incorrect', async () => {
    const updateReq = await request(server).put(`/api/users/${createdUser.id}`).send({ age: '1' });
    expect(updateReq.status).toBe(400);
    expect(updateReq.body.message).toEqual(`Bad Request : ${UserErrors.NOT_VALID_BODY}`);
  });

  test('should return an error if the hobbies type is incorrect', async () => {
    const updateReq = await request(server)
      .put(`/api/users/${createdUser.id}`)
      .send({ hobbies: '1' });
    expect(updateReq.status).toBe(400);
    expect(updateReq.body.message).toEqual(`Bad Request : ${UserErrors.NOT_VALID_BODY}`);
  });

  test('should not change the user if the data is empty', async () => {
    const updateReq = await request(server).put(`/api/users/${createdUser.id}`).send({});
    expect(updateReq.status).toBe(200);
    expect(updateReq.body).toEqual(createdUser);
  });

  test('should return error if no id to update a user', async () => {
    const req = await request(server).put(`/api/users/`);
    expect(req.status).toBe(500);
    expect(req.body.message).toEqual('Internal Server Error : Unexpected end of JSON input');
  });

  test('should return healthy message', async () => {
    const req = await request(server).get('/health');
    expect(req.status).toBe(200);
    expect(req.body).toEqual('Server is healthy');
  });
});
