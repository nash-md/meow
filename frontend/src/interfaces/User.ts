import { id } from './Card';

export interface User {
  readonly id: id;
  readonly name: string;
  readonly createdAt?: string;
  status: UserStatus;
  animal: string;
}

export enum UserStatus {
  Enabled = 'enabled',
  Disabled = 'disabled',
  Deleted = 'deleted',
  SingleSignOn = 'single-sign-on',
}
