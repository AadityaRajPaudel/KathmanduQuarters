const errorThrower = (statusCode, message) => {
  const customError = new Error();
  customError.statusCode = statusCode;
  customError.message = message;
  return customError;
};

module.exports = errorThrower;

// this function can be used anywhere to get a desired error
