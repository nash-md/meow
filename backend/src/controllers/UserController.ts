import { Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { User, UserStatus } from '../entities/User.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { InvalidUserPropertyError } from '../errors/InvalidUserPropertyError.js';
import { UserInvalidError } from '../errors/UserInvalidError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { isValidName } from './RegisterControllerValidator.js';

function parseUserStatus(value: unknown): UserStatus {
  switch (value) {
    case 'enabled':
      return UserStatus.Enabled;
    case 'disabled':
      return UserStatus.Disabled;
    case 'deleted':
      return UserStatus.Deleted;
    case 'single-sign-on':
      return UserStatus.SingleSignOn;
    default:
      throw new InvalidUserPropertyError(`Unsupported value: ${value}`);
  }
}

function generateInviteCode(length: number): string {
  const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await EntityHelper.findByTeam(User, req.jwt.team);

    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const user = await EntityHelper.findOneById(
      req.jwt.user,
      User,
      req.params.id
    );

    if (req.body.animal) {
      user.animal = req.body.animal;
    }

    if (req.body.status) {
      if (user.id === req.jwt.user.id) {
        throw new InvalidRequestBodyError();
      }

      user.status = parseUserStatus(req.body.status);

      if (user.status === UserStatus.Deleted) {
        user.password = null;
        user.invite = null;
      }
    }

    const updated = await datasource.manager.save(user);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const board = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const user = await EntityHelper.findOneById(
      req.jwt.user,
      User,
      req.params.id
    );

    user.board = req.body;

    await datasource.manager.save(user);

    return res.json({ done: true });
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
    await isValidName(req.body.name);

    const user = new User(
      req.jwt.team.id!.toString(),
      req.body.name,
      UserStatus.Invited
    );

    user.invite = generateInviteCode(8);

    const updated = await datasource.manager.save(user);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const password = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const user = await EntityHelper.findOneById(
      req.jwt.user,
      User,
      req.params.id
    );

    if (user.id?.toString() !== req.jwt.user.id?.toString()) {
      throw new UserInvalidError();
    }

    const isValidPassword =
      await new PasswordAuthenticationProvider().authenticate(
        user,
        req.body.existing
      );

    if (!isValidPassword) {
      return res.status(401).end();
    }

    user.password = await new PasswordAuthenticationProvider().create(
      req.body.updated
    );

    const updated = await datasource.manager.save(user);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const UserController = {
  list,
  create,
  update,
  board,
  password,
};
