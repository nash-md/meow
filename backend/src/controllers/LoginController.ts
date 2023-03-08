import { Request, Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { SESSION_MAX_AGE } from '../Constants.js';
import { Team } from '../entities/Team.js';
import { User, UserStatus } from '../entities/User.js';
import { AuthenticationFailedError } from '../errors/AuthenticationFailedError.js';
import { TeamNotFoundError } from '../errors/TeamNotFoundError.js';
import { TokenHelper } from '../helpers/TokenHelper.js';
import { log } from '../logger.js';
import { database } from '../worker.js';

const handle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user: User | null = null;

    if (req.body.token) {
      const payload = TokenHelper.verifyJwt(req.body.token);

      user = await database.manager.findOneById(User, payload.userId);
    }

    if (req.body.name) {
      user = await database.manager.findOneBy(User, {
        name: req.body.name,
      });

      if (!user) {
        throw new AuthenticationFailedError();
      }

      const isValidPassword =
        await new PasswordAuthenticationProvider().authenticate(
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

    const team = await database.manager.findOneById(Team, user.teamId);

    if (!team) {
      throw new TeamNotFoundError('Team not found');
    }

    const payload = {
      token: TokenHelper.createJwt(user, SESSION_MAX_AGE),
      user: user,
      team: {
        id: user.teamId,
        currency: team.currency,
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
