export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateMinLength = (value, min) => {
  return value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value.length <= max;
};

export const validateNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && value > 0;
};