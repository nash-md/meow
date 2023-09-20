import { Response, NextFunction } from 'express';
import { NewSchema, Schema, SchemaType } from '../entities/Schema.js';
import { InvalidSchemaPropertyError } from '../errors/InvalidSchemaPropertyError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { InvalidRequestQueryParameterError } from '../errors/InvalidRequestQueryParameterError.js';

function parseSchemaType(value: unknown): SchemaType {
  switch (value) {
    case 'account':
      return SchemaType.Account;
    case 'card':
      return SchemaType.Card;
    default:
      throw new InvalidSchemaPropertyError(`Unsupported type value: ${value}`);
  }
}

function parseTypeFromRequest(value: unknown): SchemaType {
  switch (value) {
    case 'account':
      return SchemaType.Account;
    case 'card':
      return SchemaType.Card;
    default:
      throw new InvalidRequestQueryParameterError(`Unsupported type ${value}`);
  }
}

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const schemas = await EntityHelper.findByTeam(Schema, req.jwt.team);

    if (req.query.type) {
      const type = parseTypeFromRequest(req.query.type);

      return res.json(schemas.filter((schema) => schema.type === type));
    } else {
      return res.json(schemas);
    }
  } catch (error) {
    return next(error);
  }
};

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const query = {
      type: { $eq: req.body.type.toString() },
      teamId: { $eq: req.jwt.team._id },
    };

    const schema = await EntityHelper.findOneBy(Schema, query);

    if (schema) {
      await EntityHelper.remove(Schema, schema);
    }

    const updated = await EntityHelper.create(
      new NewSchema(req.jwt.team, parseSchemaType(req.body.type), req.body.schema),
      Schema
    );

    return res.status(201).json(updated);
  } catch (error) {
    return next(error);
  }
};

export const SchemaController = {
  list,
  create,
};
