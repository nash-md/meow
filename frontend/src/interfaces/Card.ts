export type id = string;

export interface Card {
  readonly id: id;
  name: string;
  accountId: string;
  user: string;
  amount: number;
  lane: string;
  closedAt: string;
  readonly createdAt: string;
  updatedAt: string;
}

export interface CardPreview
  extends Omit<Card, 'id' | 'updatedAt' | 'createdAt'> {}
