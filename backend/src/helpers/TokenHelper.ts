import * as jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { UserInvalidError } from '../errors/UserInvalidError';

import { log } from '../logger';

export interface TokenPayload {
  userId: string;
  accountId: string;
  iat: number;
  exp: number;
}

const createJwt = (user: User, ttl: number): string => {
  if (!user.id) {
    throw new UserInvalidError('user.id is undefined');
  }

  const payload: TokenPayload = {
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + ttl,
    userId: user.id.toString(),
    accountId: user.accountId,
  };

  return jwt.sign(payload, process.env.SESSION_SECRET!);
};

const verifyJwt = (token: string): TokenPayload => {
  const payload = <TokenPayload>jwt.verify(token, process.env.SESSION_SECRET!);

  log.debug(`createJwt result ${JSON.stringify(payload)}`);
  // TODO add error handling
  return payload;
};

export const TokenHelper = {
  createJwt,
  verifyJwt,
};
