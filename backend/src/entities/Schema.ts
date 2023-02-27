import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
} from 'typeorm';

@Entity({ name: 'Schemas' })
export class Schema {
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Column()
  teamId: string;

  @Column()
  type: string;

  @Column({ type: 'json' })
  schema: SchemaAttribute[];

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, type: string, schema: SchemaAttribute[]) {
    this.teamId = teamId;
    this.type = type;
    this.schema = schema;
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

export interface SchemaAttribute {
  key: string;
  index: number;
  name: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}
