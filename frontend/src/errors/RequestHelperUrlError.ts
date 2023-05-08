export class RequestHelperUrlError extends Error {
  original: Error;
  constructor(original: Error) {
    super();

    this.original = original;
  }
}
