import { Request, Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { SESSION_MAX_AGE } from '../Constants.js';
import { Team } from '../entities/Team.js';
import { User, UserStatus } from '../entities/User.js';
import { AuthenticationFailedError } from '../errors/AuthenticationFailedError.js';
import { TeamNotFoundError } from '../errors/TeamNotFoundError.js';
import { TokenHelper } from '../helpers/TokenHelper.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { ObjectId } from 'mongodb';

const handle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user: User | null = null;

    if (req.body.token) {
      const payload = TokenHelper.verifyJwt(req.body.token);

      user = await datasource.manager.findOneById(User, new ObjectId(payload.userId));
    }
    if (req.body.name) {
      user = await datasource.manager.findOneBy(User, {
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

    const team = await datasource.manager.findOneById(Team, new ObjectId(user.teamId));

    if (!team) {
      throw new TeamNotFoundError('Team not found');
    }

    const payload = {
      token: TokenHelper.createJwt(user, SESSION_MAX_AGE),
      user: user,
      team: {
        id: user.teamId.toString(),
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
