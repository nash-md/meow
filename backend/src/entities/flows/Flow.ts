import { Entity, ObjectId, ObjectIdColumn, BeforeUpdate, BeforeInsert, Column } from 'typeorm';
import { EventType } from '../Event.js';

@Entity({ name: 'Flows' })
export class Flow {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  teamId: string;

  @Column()
  name: string;

  @Column()
  trigger: EventType;

  @Column()
  value: string | null;

  @Column()
  nodes: Array<FlowNode>;

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(
    teamId: string,
    name: string,
    trigger: EventType,
    value: string,
    nodes: FlowNode[] = []
  ) {
    this.teamId = teamId;
    this.name = name;
    this.trigger = trigger;
    this.value = value;
    this.nodes = nodes;
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

  findFirstNodeByType(type: FlowNodeType) {
    return this.nodes.find((node) => node.type === type);
  }
}

export enum FlowNodeType {
  WAIT = 'wait',
  SEND = 'send',
}

export abstract class FlowNode {
  type: FlowNodeType;
  attributes?: { [key: string]: string | number | boolean | null };

  constructor(type: FlowNodeType) {
    this.type = type;
  }

  abstract execute(): Promise<string | boolean | void>;
}
