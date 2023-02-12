import { Request } from 'express';
import { User } from '../entities/User.js';
import { Account } from '../entities/Account.js';

export interface AuthenticatedRequest extends Request {
  jwt: {
    user: User;
    account: Account;
  };
}
