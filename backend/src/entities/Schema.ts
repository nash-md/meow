import {
  Entity,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
  ObjectId,
} from 'typeorm';

@Entity({ name: 'Schemas' })
export class Schema {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  type: SchemaType;

  @Column({ type: 'json' })
  schema: SchemaAttribute[];

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(teamId: string, type: SchemaType, schema: SchemaAttribute[]) {
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

export enum SchemaType {
  Card = 'card',
  Account = 'account',
}

export enum SchemaAttributeType {
  Text = 'text',
  TextArea = 'textarea',
  Select = 'select',
  Reference = 'reference',
  Boolean = 'boolean',
  Email = 'email',
}

export interface SchemaAttribute {
  key: string;
  index: number;
  name: string;
  type: SchemaAttributeType;
  options?: string[];
}
