import { id } from './Card';

export interface Account {
  readonly id: id;
  currency: CurrencyCode;
}

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  SEK = 'SEK',
}
