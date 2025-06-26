import { Response, NextFunction } from 'express';
import { CurrencyCode } from '../entities/Team.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { validateAndFetchTeam } from '../helpers/EntityFetchHelper.js';
import { InvalidRequestError } from '../errors/InvalidRequestError.js';

const parseCurrencyCode = (value: string): CurrencyCode => {
    console.log('Parsing currency code:', value);
    if (value in CurrencyCode) {
        return value as CurrencyCode;
    }
    throw new InvalidRequestBodyError('invalid currency code');
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('Updating team:', req.body);
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

const allowTeamRegistration = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let team = await validateAndFetchTeam(req.params.id, req.jwt.user);

        if (team.isFirstTeam !== true) {
            throw new InvalidRequestError();
        }

        let flag = await EntityHelper.findOrCreateGlobalFlagByName('allow-team-registration');

        flag.value = req.body.allowTeamRegistration === true;

        flag = await EntityHelper.update(flag);

        delete team.isFirstTeam;

        team = await EntityHelper.update(team);

        return res.json(team);
    } catch (error) {
        return next(error);
    }
};

const get = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const team = await validateAndFetchTeam(req.params.id, req.jwt.user);

        return res.json(team);
    } catch (error) {
        return next(error);
    }
};

export const TeamController = {
    update,
    allowTeamRegistration,
    updateIntegration,
    get,
};
