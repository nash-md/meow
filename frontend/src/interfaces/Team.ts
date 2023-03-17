import { id } from './Card';

export interface Team {
  readonly id: id;
  currency: CurrencyCode;
  integrations?: Integration[];
}

export interface Integration {
  key: string;
  attributes: { [key: string]: string | number | null | boolean };
}

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  SEK = 'SEK',
}
