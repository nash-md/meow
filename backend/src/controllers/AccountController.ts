import { Response, NextFunction } from 'express';
import { Account } from '../entities/Account.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { EventHelper } from '../helpers/EventHelper.js';

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const account = new Account(req.jwt.team.id!.toString(), req.body.name);

    if (req.body.attributes) {
      account.attributes = req.body.attributes;
    }

    const updated = await datasource.manager.save(account);

    EventHelper.get().emit('account', { user: req.jwt.user, account: account.toPlain() });

    return res.status(201).json(updated);
  } catch (error) {
    return next(error);
  }
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const { body } = req;

    let account = await EntityHelper.findOneById(req.jwt.user, Account, req.params.id);

    const original = account.toPlain();

    account.name = req.body.name;

    if (body.attributes) {
      account.attributes = body.attributes;
    }

    const updated = await datasource.manager.save(account);

    EventHelper.get().emit('account', {
      user: req.jwt.user,
      account: original,
      updated: updated.toPlain(),
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const accounts = await EntityHelper.findByTeam(Account, req.jwt.team);

    return res.json(accounts);
  } catch (error) {
    return next(error);
  }
};

const fetch = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const account = await EntityHelper.findOneById(req.jwt.user, Account, req.params.id);

    return res.json(account);
  } catch (error) {
    return next(error);
  }
};

export const AccountController = {
  update,
  create,
  list,
  fetch,
};
