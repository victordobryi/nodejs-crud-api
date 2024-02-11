import { IUserDto } from '../user/user.dto';

export const validateDto = (dto: any, body: any, checkAllProperties: boolean = true): boolean => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  if (!checkAllProperties) {
    for (const key in body) {
      if (!dto.hasOwnProperty(key)) {
        return false;
      }
    }
  }

  for (const key in dto) {
    if (
      checkAllProperties
        ? dto.hasOwnProperty(key)
        : body.hasOwnProperty(key) && dto.hasOwnProperty(key)
    ) {
      const type = dto[key];
      const value = body[key];

      if (typeof value !== type) {
        return false;
      }
    }
  }

  if (checkAllProperties) {
    return isValidUserBody(body) ? true : false;
  }

  return true;
};

export function isValidUserBody(obj: IUserDto) {
  if (!('username' in obj) || typeof obj.username !== 'string') return false;
  if (!('age' in obj) || typeof obj.age !== 'number') return false;
  if (!('hobbies' in obj) || !Array.isArray(obj.hobbies)) return false;

  if (!obj.hobbies.every((hobby) => typeof hobby === 'string')) return false;

  return true;
}
