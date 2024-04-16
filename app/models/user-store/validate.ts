export const validateEmail = {
  email: {
    presence: {
      message: "Please enter an email address",
      allowEmpty: false,
    },
    email: {
      message: "Please enter a valid email address",
    },
  },
}

export const validationRules = {
  password: {
    presence: {
      message: "Please enter a password",
      allowEmpty: false,
    },
    length: {
      minimum: 8,
      tooShort: "Password must be 8 or more characters",
    },
  },
  confirm: {
    equality: {
      attribute: "password",
      message: "Passwords do not match",
    },
  },
  firstName: {
    presence: {
      message: "Please enter a first name",
      allowEmpty: false,
    },
  },
  lastName: {
    presence: {
      message: "Please enter a last name",
      allowEmpty: false,
    },
  },
  phone: {
    length: {
      minimum: 10,
      maximum: 13,
      tooShort: "Please enter a US or international phone number",
      tooLong: "Please enter a US or international phone number",
    },
  },
  address1: {
    presence: {
      message: "Please enter an address",
      allowEmpty: false,
    },
  },
  city: {
    presence: {
      message: "Please enter a city",
      allowEmpty: false,
    },
  },
  state: {
    presence: {
      message: "Please enter a state",
      allowEmpty: false,
    },
  },
  zip: {
    presence: {
      message: "Please enter a zip code",
      allowEmpty: false,
    },
  },
}
