import {
  Entity,
  ObjectId,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Accounts' })
export class Account {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column()
  attributes?: AccountAttribute;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, name: string) {
    this.teamId = teamId;
    this.name = name;
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

export interface AccountAttribute {
  [key: string]: string | number | null;
}
