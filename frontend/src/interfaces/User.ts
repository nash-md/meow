import { id } from './Card';

export interface User {
  readonly id: id;
  readonly name: string;
  readonly createdAt?: string;
  animal: string;
}
