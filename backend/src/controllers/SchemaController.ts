import { Response, NextFunction } from 'express';
import { Schema, SchemaType } from '../entities/Schema.js';
import { InvalidSchemaPropertyError } from '../errors/InvalidSchemaPropertyError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

function parseSchemaType(value: unknown): SchemaType {
  switch (value) {
    case 'card':
      return SchemaType.Card;
    case 'account':
      return SchemaType.Account;
    default:
      throw new InvalidSchemaPropertyError(
        `Unsupported status value: ${value}`
      );
  }
}

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const schemas = await EntityHelper.findByTeam(Schema, req.jwt.team);

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
        teamId: { $eq: req.jwt.team.id!.toString() },
      },
    };

    const schema = await database.getMongoRepository(Schema).findOneBy(query);

    if (schema) {
      await database.manager.delete(Schema, schema.id);
    }

    const updated = await database.manager.save(
      new Schema(
        req.jwt.team.id?.toString()!,
        parseSchemaType(req.body.type),
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
