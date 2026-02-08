export const ErrorResponse = (res, statusCode, params) => {
  return res.status(statusCode).json({
    success: false,
    message: params.message,
    data: params?.data ?? {},
    errors: params?.errors ?? {},
  });
};
