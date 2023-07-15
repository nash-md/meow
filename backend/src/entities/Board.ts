import { Entity, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column, ObjectId } from 'typeorm';

@Entity({ name: 'Boards' })
export class Board {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

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
