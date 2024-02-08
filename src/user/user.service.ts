import { User } from './user.interface';
import users from '../data/users.json';
import { UserDto } from './user.dto';

export class UserService {
  private users: User[];
  constructor() {
    this.users = users;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(user: UserDto): Promise<User> {
    const newUser = { ...user, id: String(this.users.length + 1) };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updatedUser: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return undefined;
  }

  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
