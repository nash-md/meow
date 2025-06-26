import { Response, NextFunction } from 'express';
import { Account, NewAccount } from '../entities/Account.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { EventHelper } from '../helpers/EventHelper.js';
import { validateAndFetchAccount } from '../helpers/EntityFetchHelper.js';

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const account = new NewAccount(req.jwt.team, req.body.name);

        if (req.body.attributes) {
            account.attributes = req.body.attributes;
        }

        const latest = await EntityHelper.create(account, Account);

        EventHelper.get().emit('account', { user: req.jwt.user, latest: latest.toPlain() });

        return res.status(201).json(latest);
    } catch (error) {
        return next(error);
    }
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let account = await validateAndFetchAccount(req.params.id, req.jwt.user);

        const previous = account.toPlain();

        account.name = req.body.name;

        if (req.body.attributes) {
            account.attributes = req.body.attributes;
        }

        const latest = await EntityHelper.update(account);

        // TODO rename account to original
        EventHelper.get().emit('account', {
            user: req.jwt.user,
            latest: latest.toPlain(),
            previous: previous,
        });

        return res.json(latest);
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
        const account = await validateAndFetchAccount(req.params.id, req.jwt.user);

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
