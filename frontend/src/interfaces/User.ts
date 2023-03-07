import { id } from './Card';

export interface User {
  readonly id: id;
  readonly name: string;
  readonly createdAt?: string;
  readonly teamId: string;
  status: UserStatus;
  invite?: string;
  animal: string;
}

export enum UserStatus {
  Invited = 'invited',
  Enabled = 'enabled',
  Disabled = 'disabled',
  Deleted = 'deleted',
  SingleSignOn = 'single-sign-on',
}
