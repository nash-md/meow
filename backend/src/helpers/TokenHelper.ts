import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

import { User } from '../entities/User.js';
import { log } from '../worker.js';

export interface TokenPayload {
  userId: string;
  teamId: string;
  iat: number;
  exp: number;
}

const createJwt = (user: User, ttl: number): string => {
  const payload: TokenPayload = {
    iat: Date.now() / 1000,
    exp: Math.floor(Date.now() / 1000) + ttl,
    userId: user._id.toString(),
    teamId: user.teamId.toString(),
  };

  return sign(payload, process.env.SESSION_SECRET!);
};

const verifyJwt = (token: string): TokenPayload => {
  const payload = <TokenPayload>verify(token, process.env.SESSION_SECRET!);

  log.debug(`createJwt result ${JSON.stringify(payload)}`);
  // TODO add error handling
  return payload;
};

export const TokenHelper = {
  createJwt,
  verifyJwt,
};
