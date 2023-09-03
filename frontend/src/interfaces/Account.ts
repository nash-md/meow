import { Attribute } from './Attribute';
import { id } from './Card';
import { Reference } from './Reference';

export interface Account {
  readonly id: id;
  name: string;
  attributes: Attribute | undefined;
  references?: Reference[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AccountPreview {
  name: string;
  attributes: Attribute | undefined;
}
