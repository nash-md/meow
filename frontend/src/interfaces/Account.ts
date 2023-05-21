import { Attribute } from './Attribute';
import { id } from './Card';

export interface Account {
  readonly id: id;
  name: string;
  attributes: Attribute | undefined;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AccountPreview {
  name: string;
  attributes: Attribute | undefined;
}
