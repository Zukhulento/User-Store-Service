export class CustomError extends Error {
  //* Private constructor
  // Only accessable within the class
  private constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message);
  }
  // 400 Bad Request
  static badRequest(message: string) {
    return new CustomError(400, message);
  }
  // 401 Unauthorized
  static unauthorized(message: string) {
    return new CustomError(401, message);
  }
  // 403 Forbidden
  static forbidden(message: string) {
    return new CustomError(403, message);
  }
  // 404 Not Found
  static notFound(message: string) {
    return new CustomError(404, message);
  }
  // 500 Internal Server Error
  static internalServerError(message: string) {
    console.log(message);
    return new CustomError(500, message);
  }
}
