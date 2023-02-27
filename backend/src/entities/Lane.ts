import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Lanes' })
export class Lane {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column()
  index: number;

  @Column()
  inForecast: boolean;

  @Column()
  tags: Tags;

  @Column()
  color?: string;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(
    teamId: string,
    name: string,
    index: number,
    tags: Tags,
    inForecast: boolean,
    color?: string
  ) {
    this.teamId = teamId;
    this.name = name;
    this.index = index;
    this.tags = tags;
    this.inForecast = inForecast;
    this.color = color;
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

export interface Tags {
  [key: string]: string | boolean;
}

export interface LaneRequest {
  id: string | undefined;
  name: string;
  index: number;
  inForecast: boolean;
  tags?: Tags;
  color?: string;
}
