export const validateDto = (dto: any, body: any): boolean => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  for (const key in dto) {
    if (dto.hasOwnProperty(key)) {
      const type = dto[key];
      const value = body[key];

      if (typeof value !== type) {
        return false;
      }
    }
  }

  return true;
};

export const isValidBody = (dto: any, body: any): boolean => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  for (const key in body) {
    if (body.hasOwnProperty(key) && dto.hasOwnProperty(key)) {
      const type = dto[key];
      const value = body[key];

      if (typeof value !== type) {
        return false;
      }
    }
  }

  return true;
};
