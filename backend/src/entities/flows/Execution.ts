import { Entity, ObjectId, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column } from 'typeorm';

@Entity({ name: 'Execution' })
export class Execution {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  flowId: string;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, flowId: string) {
    this.teamId = teamId;
    this.flowId = flowId;
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
