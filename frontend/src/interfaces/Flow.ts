import { EventType } from './Event';

export interface Flow {
  id?: string;
  teamId: string;
  name: string;
  trigger: EventType;
  value: string | null;
  nodes: FlowNode[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum FlowNodeType {
  WAIT = 'wait',
  SEND = 'send',
}

export interface FlowNode {
  type: FlowNodeType;
  attributes?: { [key: string]: string | number | boolean | null };
}
