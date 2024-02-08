import { User } from './user.interface';
import { UserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDB } from '../data/IMDB';

/* TODO:
  1) GET api/users/{userId}
    a) Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
    b) Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
  2) POST api/users
    a) Server should answer with status code 400 and corresponding message if request body does not contain required fields
  3) PUT api/users/{userId}
    a) Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
    b) Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
  4) DELETE api/users/{userId}
    a) Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
    b) Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
*/

export class UserService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.getAll() as User[];
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.db.get(id) as User;
  }

  async createUser(user: UserDto): Promise<User> {
    const newUser = { ...user, id: uuidv4() };
    this.db.save(newUser.id, newUser);
    return newUser;
  }

  async updateUser(id: string, updatedUser: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUserById(id);
    if (existingUser) {
      const updatedUserData = { ...existingUser, ...updatedUser };
      this.db.save(id, updatedUserData);
      return updatedUserData;
    }
    return undefined;
  }

  async deleteUser(id: string): Promise<void> {
    this.db.delete(id);
  }
}
