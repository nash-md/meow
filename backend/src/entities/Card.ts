import { Entity, ObjectId, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column } from 'typeorm';
import { Attribute } from './Attribute.js';

@Entity({ name: 'Cards' })
export class Card {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  userId: string;

  @Column()
  laneId: string;

  @Column({ type: 'timestamp' })
  inLaneSince: Date;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  status: CardStatus;

  @Column()
  attributes?: Attribute;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  @Column({ type: 'timestamp' })
  closedAt?: Date;

  @Column({ type: 'timestamp' })
  nextFollowUpAt?: Date;

  constructor(
    teamId: string,
    userId: string,
    laneId: string,
    name: string,
    amount: number,
    closedAt?: Date
  ) {
    this.teamId = teamId;
    this.userId = userId;
    this.laneId = laneId;
    this.name = name;
    this.amount = amount;
    this.closedAt = closedAt;

    this.inLaneSince = new Date();
    this.status = CardStatus.Active;
  }

  toPlain(): PlainCard {
    // TODO, validate id, createdAt, updatedAt

    return {
      id: this.id!,
      teamId: this.teamId,
      userId: this.userId,
      laneId: this.laneId,
      inLaneSince: this.inLaneSince,
      name: this.name,
      amount: this.amount,
      status: this.status,
      attributes: this.attributes,
      createdAt: this.createdAt!,
      updatedAt: this.updatedAt!,
      closedAt: this.closedAt,
      nextFollowUpAt: this.nextFollowUpAt,
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

export enum CardStatus {
  Active = 'active',
  Deleted = 'deleted',
}

export interface PlainCard {
  id: ObjectId;
  teamId: string;
  userId: string;
  laneId: string;
  inLaneSince: Date;
  name: string;
  amount: number;
  status: CardStatus;
  attributes?: Attribute;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  nextFollowUpAt?: Date;
}
