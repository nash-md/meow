import { StatusCodes } from 'http-status-codes';

export interface ErrorResponse {
  name: string;
  description?: string | undefined;
}

export abstract class ApplicationError extends Error {
  name: string;
  code: StatusCodes;
  description?: string;

  constructor(name: string, code: StatusCodes, description?: string) {
    super();

    this.name = name
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/\_exception/, '')
      .substr(1);
    this.code = code;
    this.description = description;
  }

  toResponse() {
    const payload: ErrorResponse = {
      name: this.name,
    };

    if (this.description) {
      payload.description = this.description;
    }

    return payload;
  }
}
