import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Events' })
export class Event {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  accountId: string;

  @Column()
  cardId: string;

  @Column()
  userId: string;

  @Column()
  type: EventType;

  @Column()
  body?: any; // TODO already defined on FE

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(
    accountId: string,
    cardId: string,
    userId: string,
    type: EventType,
    body?: any
  ) {
    this.accountId = accountId;
    this.cardId = cardId;
    this.userId = userId;
    this.type = type;
    this.body = body;
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

// TODO inconsistent naming
export enum EventType {
  Comment = 'comment',
  Lane = 'lane',
  Amount = 'amount',
  ClosedAt = 'closed-at',
  CreatedAt = 'created-at',
  Assign = 'assign',
}
