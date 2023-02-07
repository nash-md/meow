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
  key: string;

  @Column()
  name: string;

  @Column()
  index: number;

  @Column()
  inForecast: boolean;

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
    inForecast: boolean,
    color?: string
  ) {
    this.accountId = accountId;
    this.name = name;
    this.key = key;
    this.index = index;
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
