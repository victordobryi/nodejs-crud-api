export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export enum UserErrors {
  USER_NOT_FOUND = 'User not found',
  NOT_VALID_ID = 'Not valid user id',
  NOT_VALID_BODY = 'Invalid user data',
}
