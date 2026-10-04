/**
 * Thrown anywhere in a route/controller to produce a consistent error
 * response. Express 5 forwards thrown/rejected errors from async handlers
 * to the error middleware automatically — no manual try/catch wrapper needed.
 */
export class ApiError extends Error {
  statusCode: number
  code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
  }

  static badRequest(message: string, code = 'BAD_REQUEST') {
    return new ApiError(400, code, message)
  }

  static notFound(message: string, code = 'NOT_FOUND') {
    return new ApiError(404, code, message)
  }
}
