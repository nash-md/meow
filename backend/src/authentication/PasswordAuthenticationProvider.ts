import { compare, hash } from 'bcrypt';
import { User } from '../entities/User';
import { UserInvalidError } from '../errors/UserInvalidError';

export interface PasswordUserAuthentication {
  secret: string;
}

export class PasswordAuthenticationProvider {
  authenticate = async (user: User, plain: string): Promise<boolean> => {
    if (!user.password) {
      throw new UserInvalidError();
    }

    return await compare(plain, user.password);
  };

  create = async (password: string): Promise<string> => {
    const value = await hash(password, 10);

    return value;
  };
}
