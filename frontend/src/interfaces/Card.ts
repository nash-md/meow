export type id = string;

export interface Card {
  readonly id: id;
  name: string;
  accountId: string;
  user: string;
  amount: number;
  lane: string;
  attributes: CardAttribute[];
  closedAt: string;
  readonly createdAt: string;
  updatedAt: string;
}

export interface CardAttribute {
  keyId: string;
  value: string;
}

export interface CardPreview
  extends Omit<Card, 'id' | 'updatedAt' | 'createdAt'> {}
