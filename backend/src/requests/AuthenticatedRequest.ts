import { Request } from 'express';
import { User } from '../entities/User.js';
import { Team } from '../entities/Team.js';

export interface AuthenticatedRequest extends Request {
  jwt: {
    user: User;
    team: Team;
  };
}
