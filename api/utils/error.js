const errorThrower = (statusCode, message) => {
  const customError = new Error();
  customError.statusCode = statusCode;
  customError.message = message;
  return customError;
};
export default errorThrower;
// this function can be used anywhere to get a desired error
