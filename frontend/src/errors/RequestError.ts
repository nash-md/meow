export class RequestError extends Error {
  request: Response | RequestInit;
  response: Response;
  constructor(
    request: Request | RequestInit,
    response: Response,
    message: string
  ) {
    super(message);

    this.request = request;
    this.response = response;
  }
}
