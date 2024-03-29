import { Request, Response, NextFunction } from 'express';
import { InvalidContentTypeError } from '../errors/InvalidContentTypeError.js';

type ContentType =
  | 'application/json'
  | 'text/plain'
  | 'application/x-www-form-urlencoded';

export const rejectIfContentTypeIsNot = (contentType: ContentType) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.headers['content-type'] === contentType) {
      return next();
    } else {
      return next(new InvalidContentTypeError('invalid content type'));
    }
  };
};
