import { User } from './user.interface';
import { IUserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDB } from '../data/IMDB';
import { getErrorMessage } from '../utils/getErrorMessage';

export class UserService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return this.db.getAll() as User[];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      return this.db.get(id) as User;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async createUser(user: IUserDto): Promise<User> {
    try {
      const newUser = { ...user, id: uuidv4() };
      this.db.save(newUser.id, newUser);
      return newUser;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async updateUser(existingUser: User, updatedUser: Partial<User>): Promise<User> {
    try {
      const updatedUserData = { ...existingUser, ...updatedUser };

      this.db.save(existingUser.id, updatedUserData);

      return updatedUserData;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      this.db.delete(id);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}
