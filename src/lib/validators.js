export const emailValidator = (email) => {
  const mailFormat =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return String(email).match(mailFormat);
};

export const passwordValidator = (password) => {
  return password.length >= 8;
};
