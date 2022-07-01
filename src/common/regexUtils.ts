export const usernamePattern = '[a-zA-Z0-9]{6,25}';
export const usernamePatternTitle =
  'Minimum of 6 characters, no spaces or special symbols';

export const passwordPattern = '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}';
export const passwordPatternTitle =
  'Minimum of 8 characters, one lowercase letter, one uppercase letter and a digit';
