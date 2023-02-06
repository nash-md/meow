import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  accountId: string;

  @Column()
  name: string;

  @Column()
  password?: string;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(accountId: string, name: string) {
    this.accountId = accountId;
    this.name = name;
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
