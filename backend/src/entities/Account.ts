import { Entity, ObjectId, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column } from 'typeorm';
import { Attribute } from './Attribute.js';

@Entity({ name: 'Accounts' })
export class Account {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column()
  attributes?: Attribute;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, name: string) {
    this.teamId = teamId;
    this.name = name;
  }

  toPlain(): PlainAccount {
    return {
      id: this.id!,
      teamId: this.teamId,
      name: this.name,
      attributes: this.attributes,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
    };
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

export interface PlainAccount {
  id: ObjectId;
  teamId: string;
  name: string;
  attributes?: Attribute;
  createdAt: Date;
  updatedAt: Date;
}
