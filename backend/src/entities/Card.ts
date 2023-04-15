import {
  Entity,
  ObjectId,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

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
  attributes?: CardAttribute;

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

export enum CardStatus {
  Active = 'active',
  Deleted = 'deleted',
}
