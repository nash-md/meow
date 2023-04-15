import { Response, NextFunction } from 'express';
import { CurrencyCode, Team } from '../entities/Team.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';

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
      const team = await EntityHelper.findOneById(
        req.jwt.user,
        Team,
        req.params.id
      );

      team.currency = parseCurrencyCode(req.body.currency);

      const updated = await datasource.manager.save(team);

      return res.json(updated);
    }
  } catch (error) {
    return next(error);
  }
};

const updateIntegration = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.id) {
      const team = await EntityHelper.findOneById(
        req.jwt.user,
        Team,
        req.params.id
      );

      const integrations = team.integrations ?? [];

      const updatedIntegrations = integrations.filter(
        (integration) => integration.key !== req.body.key
      );

      updatedIntegrations.push(req.body);

      team.integrations = updatedIntegrations;

      const updated = await datasource.manager.save(team);

      return res.json(updated);
    }
  } catch (error) {
    return next(error);
  }
};

const get = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.id) {
      const team = await EntityHelper.findOneById(
        req.jwt.user,
        Team,
        req.params.id
      );

      return res.json(team);
    }
  } catch (error) {
    return next(error);
  }
};

export const TeamController = {
  update,
  updateIntegration,
  get,
};
