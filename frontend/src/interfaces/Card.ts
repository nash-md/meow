export type id = string;

export interface Card {
  readonly id: id;
  name: string;
  accountId: string;
  user: string;
  amount: number;
  lane: string;
  attributes: CardAttribute | undefined;
  closedAt?: string;
  readonly createdAt: string;
  updatedAt: string;
}

export interface CardAttribute {
  [key: string]: string | number | null;
}

export interface CardPreview {
  name: string;
  user: string;
  amount: number;
  lane: string;
  attributes: CardAttribute | undefined;
  closedAt?: string;
}

export interface CardFormPreview {
  name: string;
  user: string;
  amount: string;
  lane: string;
  attributes: CardAttribute | undefined;
  closedAt?: string;
}
