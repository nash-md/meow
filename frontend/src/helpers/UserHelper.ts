import {
  MINIMUM_LENGTH_OF_USER_NAME,
  MAXIMUM_LENGTH_OF_USER_NAME,
  RESERVED_USERS,
  MINIMUM_LENGTH_OF_USER_PASSWORD,
  MAXIMUM_LENGTH_OF_USER_PASSWORD,
} from '../Constants';

export const UserHelper = {
  isValidNameAndPassword(name: string | undefined, password: string | undefined) {
    if (!name || !password) {
      return false;
    }

    if (name.length < MINIMUM_LENGTH_OF_USER_NAME || name.length > MAXIMUM_LENGTH_OF_USER_NAME) {
      return false;
    }

    if (RESERVED_USERS.includes(name)) {
      return false;
    }

    if (
      password.length < MINIMUM_LENGTH_OF_USER_PASSWORD ||
      password.length > MAXIMUM_LENGTH_OF_USER_PASSWORD
    ) {
      return false;
    }

    return true;
  },

  isValidName(name: string) {
    if (!name) {
      return false;
    }

    if (name.length < MINIMUM_LENGTH_OF_USER_NAME || name.length > MAXIMUM_LENGTH_OF_USER_NAME) {
      return false;
    }

    if (RESERVED_USERS.includes(name)) {
      return false;
    }

    return true;
  },
};
