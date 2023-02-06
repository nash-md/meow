import {
  MAXIMUM_LENGTH_OF_USER_PASSWORD,
  MINIMUM_LENGTH_OF_USER_PASSWORD,
} from '../Constants';
import { User } from '../entities/User';
import { InvalidUserPropertyError } from '../errors/InvalidUserPropertyError';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError';
import { database } from '../worker';

export const isValidPassword = async (password: string) => {
  if (password.length < MINIMUM_LENGTH_OF_USER_PASSWORD) {
    throw new InvalidUserPropertyError('password is too short'); // TODO, move to dedicated RequestError
  }

  if (password.length > MAXIMUM_LENGTH_OF_USER_PASSWORD) {
    throw new InvalidUserPropertyError('password is too long');
  }

  return Promise.resolve();
};

const isString = (value: unknown): value is string => {
  return Object.prototype.toString.call(value) === '[object String]';
};

export const isValidName = async (name: unknown) => {
  if (!isString(name)) {
    throw new InvalidUserPropertyError('name it not type string');
  }

  const count = await database.manager.countBy(User, { name: name });

  if (count > 0) {
    throw new UserAlreadyExistsError();
  }
};
