export const validateDto = (dto: any, body: any, checkAllProperties: boolean = true): boolean => {
  if (!body || typeof body !== 'object') {
    return false;
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

  return true;
};
