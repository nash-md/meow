import { Response, NextFunction } from 'express';
import { Account } from '../entities/Account.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { AccountEventService } from '../services/AccountEventService.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';

const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = new Account(req.jwt.team.id!.toString(), req.body.name);

    if (req.body.attributes) {
      account.attributes = req.body.attributes;
    }

    const updated = await datasource.manager.save(account);

    const accountEventService = new AccountEventService(datasource);

    accountEventService.add(updated, req.jwt.user);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const { body } = req;

    let account = await EntityHelper.findOneById(
      req.jwt.user,
      Account,
      req.params.id
    );

    const accountEventService = new AccountEventService(datasource);

    account = await accountEventService.update(body, account, req.jwt.user);

    account.name = req.body.name;

    const updated = await datasource.manager.save(account);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await EntityHelper.findByTeam(Account, req.jwt.team);

    return res.json(cards);
  } catch (error) {
    return next(error);
  }
};

export const AccountController = {
  update,
  create,
  list,
};
