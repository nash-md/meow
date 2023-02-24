export type id = string;

export interface Card {
  readonly id: id;
  name: string;
  accountId: string;
  userId: string;
  amount: number;
  laneId: string;
  status?: CardStatus;
  attributes: CardAttribute | undefined;
  closedAt?: string;
  readonly createdAt: string;
  updatedAt: string;
}

export interface CardAttribute {
  [key: string]: string | number | null;
}

export enum CardStatus {
  Active = 'active',
  Deleted = 'deleted',
}

export interface CardPreview {
  name: string;
  userId: string;
  amount: number;
  laneId: string;
  attributes: CardAttribute | undefined;
  closedAt?: string;
}

export interface CardFormPreview {
  name: string;
  userId: string;
  amount: string;
  laneId: string;
  attributes: CardAttribute | undefined;
  closedAt?: string;
}
