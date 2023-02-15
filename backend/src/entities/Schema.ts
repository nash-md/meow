import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Schemas' })
export class Schema {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  accountId: string;

  @Column()
  type: string;

  @Column()
  schema: any;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(accountId: string, type: string, schema: string) {
    this.accountId = accountId;
    this.type = type;
    this.schema = schema;
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
