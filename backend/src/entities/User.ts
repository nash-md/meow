import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';
import { Card } from './Card.js';

@Entity({ name: 'Users' })
export class User {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column({ select: false })
  password?: string | null;

  @Column()
  animal?: string;

  @Column()
  invite?: string | null;

  @Column()
  status?: UserStatus;

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
