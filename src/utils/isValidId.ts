import { validate } from 'uuid';

export const isValidId = (id: string) => validate(id);
