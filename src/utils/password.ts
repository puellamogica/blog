export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_PATTERN = /^[A-Za-z0-9!@#$%^&*]+$/;

export const isValidPassword = (value: string): boolean =>
  value.length >= PASSWORD_MIN_LENGTH &&
  value.length <= PASSWORD_MAX_LENGTH &&
  PASSWORD_PATTERN.test(value);
