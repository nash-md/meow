import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { Card } from './Card.js';
import { Team } from './Team.js';

@Entity({ name: 'Users' })
export class User implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  name: string;
  status: UserStatus;
  animal?: string;
  locale?: string;
  lastLoginAt?: Date;
  invite?: string | null;
  authentication?: UserAuthentication | null;
  color?: string;
  flags?: Flag[];
  board?: { [key: string]: Card['_id'][] };
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    name: string,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.name = name;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    const authenticationType = this.authentication?.google ? 'google' : 'local';

    return { ...this, authentication: authenticationType };
  }
}

@Entity({ name: 'Users' })
export class NewUser implements NewEntity {
  teamId: ObjectId;
  name: string;
  status: UserStatus;
  animal?: string;
  locale?: string;
  lastLoginAt?: Date;
  invite?: string | null;
  authentication?: UserAuthentication | null;
  color?: string;
  flags?: Flag[];
  board?: { [key: string]: Card['_id'][] };
  createdAt: Date;
  updatedAt: Date;

  constructor(team: Team, name: string, status: UserStatus) {
    this.teamId = team._id!;
    this.name = name;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export enum UserStatus {
  Invited = 'invited',
  Enabled = 'enabled',
  Disabled = 'disabled',
  Deleted = 'deleted',
  SingleSignOn = 'single-sign-on',
}

export interface UserAuthentication {
  local?: {
    password: string;
  };
  google?: {
    id: string;
  };
}

export interface Flag {
  [key: string]: string | number | boolean | null;
}
