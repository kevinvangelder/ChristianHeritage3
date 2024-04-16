export const cardRules = {
  ACCOUNT_HOLDER_NAME: {
    presence: { message: "Please enter a valid name" },
  },
  CARD_NO: {
    presence: { message: "Please enter a valid credit card number" },
    length: {
      minimum: 13,
      maximum: 16,
    },
  },
  EXPIRATION_MONTH: {
    presence: { message: "Please select a valid month" },
    numericality: {
      greaterThanOrEqualTo: 1,
      notGreaterThanOrEqualTo: "Please select a valid month",
      lessThanOrEqualTo: 12,
      notLessThanOrEqualTo: "Please select a valid month",
    },
  },
  EXPIRATION_YEAR: {
    presence: { message: "Please select a valid year" },
    numericality: {
      greaterThanOrEqualTo: 22,
      notGreaterThanOrEqualTo: "Please select a valid year",
    },
  },
  CVV_NO: {
    presence: { message: "Please enter a valid CVV" },
    length: {
      minimum: 3,
      maximum: 4,
    },
  },
  ZIP_CODE: {
    presence: { message: "Please enter a valid zip code" },
    length: {
      minimum: 5,
      maximum: 20,
    },
  },
}

export const couponRules = {
  coupon: {
    presence: { message: "Enter a valid coupon", allowEmpty: false },
    length: {
      maximum: 25,
    },
  },
}
