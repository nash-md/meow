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
  accountId: string;

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
    accountId: string,
    key: string,
    name: string,
    index: number,
    tags: Tags,
    inForecast: boolean,
    color?: string
  ) {
    this.accountId = accountId;
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

  static createKeyFromName(value: string) {
    return value
      .replace(/[A-Z]/g, (letter) => `${letter.toLowerCase()}`)
      .replace(/ /, '-');
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
