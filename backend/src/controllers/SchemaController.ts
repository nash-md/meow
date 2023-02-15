import { Response, NextFunction } from 'express';
import { Schema } from '../entities/Schema.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      accountId: { $eq: req.jwt.account.id!.toString() },
    };

    let schemas = await database.getMongoRepository(Schema).findBy(query);

    return res.json(schemas);
  } catch (error) {
    return next(error);
  }
};

const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      where: {
        type: { $eq: req.body.type },
        accountId: { $eq: req.jwt.account.id!.toString() },
      },
    };

    const schema = await database.getMongoRepository(Schema).findOneBy(query);

    if (schema) {
      await database.manager.delete(Schema, schema.id);
    }

    const updated = await database.manager.save(
      new Schema(
        req.jwt.account.id?.toString()!,
        req.body.type,
        req.body.schema
      )
    );

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const SchemaController = {
  list,
  create,
};
