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
  AmountUpdated = 'amount-updated',
  AttributeUpdated = 'attribute-updated',
  ClosedAtUpdated = 'closed-at-updated',
  NextFollowUp = 'next-follow-up',
  Created = 'Created',
  Assigned = 'assigned',
  Deleted = 'delted',
}
