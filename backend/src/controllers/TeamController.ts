import { Response, NextFunction } from 'express';
import { CurrencyCode } from '../entities/Team.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { validateAndFetchTeam } from '../helpers/EntityFetchHelper.js';

const parseCurrencyCode = (value: string): CurrencyCode => {
  if (value in CurrencyCode) {
    return value as CurrencyCode;
  }
  throw new InvalidRequestBodyError('invalid currency code');
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const team = await validateAndFetchTeam(req.params.id, req.jwt.user);

    team.currency = parseCurrencyCode(req.body.currency);

    const updated = await EntityHelper.update(team);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const updateIntegration = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const team = await validateAndFetchTeam(req.params.id, req.jwt.user);

    const integrations = team.integrations ?? [];

    const updatedIntegrations = integrations.filter(
      (integration) => integration.key !== req.body.key
    );

    updatedIntegrations.push(req.body);

    team.integrations = updatedIntegrations;

    const updated = await EntityHelper.update(team);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const get = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const team = await validateAndFetchTeam(req.params.id, req.jwt.user);

  return res.json(team);
};

export const TeamController = {
  update,
  updateIntegration,
  get,
};
