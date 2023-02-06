import { Request } from 'express';
import { User } from '../entities/User';
import { Account } from '../entities/Account';

export interface AuthenticatedRequest extends Request {
  jwt: {
    user: User;
    account: Account;
  };
}
