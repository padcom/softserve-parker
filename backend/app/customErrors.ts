export class UnauthenticatedError extends Error {
  status: number
  constructor(...params) {
    super(...params)
    this.name = 'UnauthenticatedError';
    this.status = 403

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, UnauthenticatedError);
    }
  }
}