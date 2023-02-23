import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Cards' })
export class Card {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  accountId: string;

  @Column()
  user: string;

  @Column()
  lane: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  isDeleted?: boolean;

  @Column()
  attributes?: CardAttribute;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  @Column({ type: 'timestamp' })
  closedAt?: Date;

  constructor(
    accountId: string,
    user: string,
    lane: string,
    name: string,
    amount: number,
    closedAt?: Date
  ) {
    this.accountId = accountId;
    this.user = user;
    this.lane = lane;
    this.name = name;
    this.amount = amount;
    this.closedAt = closedAt;
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

export interface CardAttribute {
  [key: string]: string | number | null;
}
