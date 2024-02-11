import { User } from './user.interface';
import { InMemoryDB } from '../data/IMDB';
import { getErrorMessage } from '../utils/getErrorMessage';
import { MasterInMemoryDB } from '../data/masterIMDB';

export class UserService {
  private db: InMemoryDB | MasterInMemoryDB;
  constructor(db: InMemoryDB | MasterInMemoryDB) {
    this.db = db;
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

  async createUser(user: User): Promise<User> {
    try {
      this.db.save(user);
      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async updateUser(existingUser: User, updatedUser: Partial<User>): Promise<User> {
    try {
      const updatedUserData = { ...existingUser, ...updatedUser };
      this.db.save(updatedUserData);
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
