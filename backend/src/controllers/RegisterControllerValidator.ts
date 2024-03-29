import {
  MAXIMUM_LENGTH_OF_USER_PASSWORD,
  MINIMUM_LENGTH_OF_USER_PASSWORD,
  RESERVED_USERS,
} from '../Constants.js';
import { User } from '../entities/User.js';
import { InvalidUserPropertyError } from '../errors/InvalidUserPropertyError.js';
import { UserAlreadyExistsError } from '../errors/UserAlreadyExistsError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';

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

  if (RESERVED_USERS.includes(name)) {
    throw new InvalidUserPropertyError(`${name} is reserved and cannot be used`);
  }

  const query = {
    name: { $regex: RegExp(`^${name}$`, 'i') },
    'authentication.local': { $exists: true },
  };

  const users = await EntityHelper.findOneBy(User, query);

  if (users) {
    throw new UserAlreadyExistsError();
  }
};
