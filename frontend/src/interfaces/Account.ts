import { id } from './Card';

export interface Account {
  readonly id: id;
  name: string;
  address: string;
  phone: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AccountPreview {
  name: string;
  address: string;
  phone: string;
}
