import { Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider';
import { Lane, LaneRequest } from '../entities/Lane';
import { User } from '../entities/User';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { InvalidUrlError } from '../errors/InvalidUrlError';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest';
import { database } from '../worker';
import { isValidName, isValidPassword } from './RegisterControllerValidator';

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      accountId: { $eq: req.jwt.account.id!.toString() },
    };

    let users = await database.getMongoRepository(User).findBy(query);

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
    await isValidName(req.body.name);
    await isValidPassword(req.body.password);

    if (!req.params.id) {
      throw new InvalidUrlError();
    }

    const user = await database
      .getMongoRepository(User)
      .findOneById(req.params.id);

    if (
      !user ||
      user.accountId?.toString() !== req.jwt.account.id?.toString() // TODO remove toString()
    ) {
      throw new EntityNotFoundError();
    }

    user.name = req.body.name;
    user.password = await new PasswordAuthenticationProvider().create(
      req.body.password
    );

    const updated = await database.manager.save(user);

    return res.json(updated);
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

export const UserController = {
  list,
  create,
  update,
};
