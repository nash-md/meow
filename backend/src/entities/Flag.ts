import { Entity, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column, ObjectId } from 'typeorm';

@Entity({ name: 'Flags' })
export class Flag {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column()
  value: string | number | boolean | null | string[] | number[];

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, name: string, value: any = null) {
    this.teamId = teamId;
    this.name = name;
    this.value = value;
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
