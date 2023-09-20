import { compare, hash } from 'bcrypt';
import { User } from '../entities/User.js';
import { UserInvalidError } from '../errors/UserInvalidError.js';

export interface PasswordUserAuthentication {
  secret: string;
}

export class PasswordAuthenticationProvider {
  authenticate = async (user: User, plain: string): Promise<boolean> => {
    if (!user.authentication?.local) {
      throw new UserInvalidError();
    }

    return await compare(plain, user.authentication.local.password);
  };

  create = async (password: string): Promise<string> => {
    const value = await hash(password, 10);

    return value;
  };
}
