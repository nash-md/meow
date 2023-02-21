import { Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { User, UserStatus } from '../entities/User.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { InvalidUrlError } from '../errors/InvalidUrlError.js';
import { InvalidUserPropertyError } from '../errors/InvalidUserPropertyError.js';
import { UserInvalidError } from '../errors/UserInvalidError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';
import { isValidName, isValidPassword } from './RegisterControllerValidator.js';

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

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await EntityHelper.findByAccoount(User, req.jwt.account);

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
        user.password = '';
      }
    }

    const updated = await database.manager.save(user);

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

    await database.manager.save(user);

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
    await isValidPassword(req.body.password);

    const user = new User(req.jwt.account.id!.toString(), req.body.name);

    user.password = await new PasswordAuthenticationProvider().create(
      req.body.password
    );

    const updated = await database.manager.save(user);

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

    const updated = await database.manager.save(user);

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
