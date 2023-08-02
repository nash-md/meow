import { Entity, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column, ObjectId } from 'typeorm';
import { Card } from './Card.js';

@Entity({ name: 'Users' })
export class User {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column({ select: false })
  password?: string | null;

  @Column()
  animal?: string;

  @Column()
  locale?: string;

  @Column()
  invite?: string | null;

  @Column()
  authentication?: UserAuthentication | null;

  @Column()
  status?: UserStatus;

  @Column()
  color?: string;

  @Column()
  flags?: Flag[];

  @Column()
  board?: { [key: string]: Card['id'][] };

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, name: string, status: UserStatus) {
    this.teamId = teamId;
    this.name = name;
    this.status = status;
  }

  toJSON() {
    delete this.password;
    return this;
  }

  @BeforeInsert()
  insertCreated() {
    this.updatedAt = new Date();
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  insertUpdated() {
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
}

export interface Flag {
  [key: string]: string | number | boolean | null;
}
