import { id } from './Card';

export interface Account {
  readonly id: id;
  name: string;
  attributes: AccountAttribute | undefined;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AccountAttribute {
  [key: string]: string | number | null;
}

export interface AccountPreview {
  name: string;
  attributes: AccountAttribute | undefined;
}
