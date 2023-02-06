export class ResponseParseError extends Error {
  response: Response;
  constructor(response: Response, message: string) {
    super(message);

    this.response = response;
  }
}
