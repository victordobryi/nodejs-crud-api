export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export enum UserErrors {
  USER_NOT_FOUND = 'User not found',
  USERS_NOT_FOUND = 'Users not found',
}
