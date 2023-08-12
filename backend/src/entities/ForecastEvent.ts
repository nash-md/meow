import { Entity, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column, ObjectId } from 'typeorm';
import { EventType } from './Event.js';

@Entity({ name: 'Events' })
export class ForecastEvent {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  laneId: string;

  @Column()
  userId?: string;

  @Column()
  type: EventType;

  @Column()
  amount: number;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, laneId: string, amount: number, userId?: string) {
    this.teamId = teamId;
    this.laneId = laneId;
    this.amount = amount;
    this.type = EventType.LaneAmountChanged;

    if (userId) {
      this.userId = userId;
    }
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
