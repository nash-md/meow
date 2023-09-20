import { Request, Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { SESSION_MAX_AGE } from '../Constants.js';
import { Team } from '../entities/Team.js';
import { User, UserStatus } from '../entities/User.js';
import { AuthenticationFailedError } from '../errors/AuthenticationFailedError.js';
import { TokenHelper } from '../helpers/TokenHelper.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';

const handle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user: User | null = null;

    if (req.body.token) {
      const payload = TokenHelper.verifyJwt(req.body.token);

      user = await EntityHelper.findOneById(User, payload.userId);
    }

    if (req.body.name) {
      user = await EntityHelper.findOneBy(User, {
        name: req.body.name,
      });

      if (!user) {
        throw new AuthenticationFailedError();
      }

      const isValidPassword = await new PasswordAuthenticationProvider().authenticate(
        user,
        req.body.password
      );

      if (!isValidPassword) {
        throw new AuthenticationFailedError();
      }
    }

    if (!user || user.status !== UserStatus.Enabled) {
      throw new AuthenticationFailedError();
    }

    const team = await EntityHelper.findOneById(Team, user.teamId);

    if (!team) {
      throw new EntityNotFoundError('Team not found');
    }

    user.lastLoginAt = new Date();

    await EntityHelper.update(user);

    const payload = {
      token: TokenHelper.createJwt(user, SESSION_MAX_AGE),
      user: user,
      team: {
        _id: user.teamId.toString(),
        currency: team.currency,
        integrations: Array.isArray(team.integrations)
          ? team.integrations.map((integration) => {
              return { key: integration.key };
            })
          : [],
      },
      board: user.board,
    };

    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const LoginController = {
  handle,
};
