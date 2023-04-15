import {
  Entity,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
  ObjectId,
} from 'typeorm';

@Entity({ name: 'Events' })
export class Event {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  entityId: string;

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
    teamId: string,
    entityId: string,
    userId: string,
    type: EventType,
    body?: any
  ) {
    this.teamId = teamId;
    this.entityId = entityId;
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

export enum EventType {
  CommentCreated = 'comment-created',
  LaneMoved = 'lane-moved',
  AmountChanged = 'amount-changed',
  AttributeChanged = 'attribute-changed',
  ClosedAtChanged = 'closed-at-changed',
  NextFollowUpAtChanged = 'next-follow-up-at-changed',
  Created = 'created',
  Assigned = 'assigned',
  Deleted = 'deleted',
}
