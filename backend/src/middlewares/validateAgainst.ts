import Ajv from 'ajv';
import { Response } from 'express';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { log } from '../worker.js';

export const validateAgainst = (schema: {}) => {
  // @ts-ignore
  const ajv = new Ajv({
    strict: true,
    allowUnionTypes: true,
  });

  const validate = ajv.compile(schema);

  return (request: AuthenticatedRequest, response: Response, next: Function) => {
    const isValid = validate(request.body);
    if (isValid) {
      return next();
    } else {
      let message = '';

      if (validate.errors) {
        message = validate.errors.map((error: any) => JSON.stringify(error)).toString();
      }

      log.info(`JSON schema validation failed ${message}`);
      return next(new InvalidRequestBodyError());
    }
  };
};
