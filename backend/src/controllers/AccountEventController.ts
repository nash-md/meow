import { Response, NextFunction } from 'express';
import { EventType } from '../entities/EventType.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { ObjectId, Sort } from 'mongodb';
import { AccountEvent, NewAccountEvent } from '../entities/AccountEvent.js';
import { validateAndFetchAccount } from '../helpers/EntityFetchHelper.js';

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const query = {
      accountId: { $eq: new ObjectId(req.params.id) },
      teamId: { $eq: req.jwt.team._id },
    };

    const sort: Sort = {
      updatedAt: -1,
    };

    const events = await EntityHelper.findBy(AccountEvent, query, sort);
    return res.json(events);
  } catch (error) {
    return next(error);
  }
};

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const account = await validateAndFetchAccount(req.params.id, req.jwt.user);

    let event = new NewAccountEvent(account, req.jwt.user, EventType.CommentCreated, {
      text: req.body.text,
    });

    const updated = await EntityHelper.create(event, AccountEvent);

    return res.status(201).json(updated);
  } catch (error) {
    return next(error);
  }
};

export const AccountEventController = {
  list,
  create,
};
