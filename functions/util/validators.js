const isEmail = (email) => {
  const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailFormat)) return true;
  else return false;
};
const checkPassword = (password) => {
  const passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
  if (password.match(passwordFormat)) return true;
  else return false;
};
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Email tidak boleh kosong';
  } else if (!isEmail(data.email)) {
    errors.email = 'Format alamat email salah';
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password tidak boleh kosong';
  } else if (!checkPassword(data.password)) {
    errors.password =
      'Password harus terdiri dari nomor, huruf kecil dan huruf kapital';
  }
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Password harus sama';
  if (isEmpty(data.handle)) errors.handle = 'Username tidak boleh kosong';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Email tidak boleh kosong';
  if (isEmpty(data.password)) errors.password = 'Password tidak boleh kosong';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
