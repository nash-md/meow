import { id } from './Card';

export interface Team {
  readonly _id: id;
  readonly name: string;
  currency: CurrencyCode;
  integrations: Integration[];
  readonly isFirstTeam?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface Integration {
  key: string;
  attributes: { [key: string]: string | number | null | boolean };
}

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  SEK = 'SEK',
  MT2 = 'MT2',
  GPB = 'GBP',
}
