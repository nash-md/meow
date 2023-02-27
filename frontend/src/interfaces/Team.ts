import { id } from './Card';

export interface Team {
  readonly id: id;
  currency: CurrencyCode;
}

export interface AccountPreview {
  name: string;
  address: string;
  phone: string;
}

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  SEK = 'SEK',
}
