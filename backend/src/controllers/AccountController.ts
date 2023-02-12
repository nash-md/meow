import { Response, NextFunction } from 'express';
import { Account, CurrencyCode } from '../entities/Account.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

const parseCurrencyCode = (value: string): CurrencyCode => {
  if (value in CurrencyCode) {
    return value as CurrencyCode;
  }
  throw new InvalidRequestBodyError('invalid currency code');
};

const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.id) {
      const account = await database
        .getMongoRepository(Account)
        .findOneById(req.params.id);

      if (
        !account ||
        account.id?.toString() !== req.jwt.account.id?.toString() // TODO remove toString()
      ) {
        throw new EntityNotFoundError();
      }

      account.currency = parseCurrencyCode(req.body.currency);

      const updated = await database.manager.save(account);

      return res.json(updated);
    }
  } catch (error) {
    return next(error);
  }
};

export const AccountController = {
  update,
};
