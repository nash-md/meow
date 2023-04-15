import {
  Entity,
  ObjectIdColumn,
  BeforeUpdate,
  BeforeInsert,
  Column,
  ObjectId,
} from 'typeorm';

@Entity({ name: 'Teams' })
export class Team {
  @ObjectIdColumn()
  id: ObjectId | undefined;

  @Column()
  name: string;

  @Column()
  currency: CurrencyCode;

  @Column()
  integrations?: Integration[];

  @Column({ type: 'timestamp' })
  createdAt?: Date;

  @Column({ type: 'timestamp' })
  updatedAt?: Date;

  constructor(name: string, currency: CurrencyCode) {
    this.name = name;
    this.currency = currency;
  }

  @BeforeInsert()
  insertCreated() {
    this.updatedAt = new Date();
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  insertUpdated() {
    this.updatedAt = new Date();
  }

  toJSON() {
    if (!this.integrations) return this;

    const filteredIntegrations = this.integrations.map((integration) => {
      return {
        key: integration.key,
        attributes: Object.keys(integration.attributes).reduce(
          (acc, curr) => ({ ...acc, [curr]: null }),
          {}
        ),
      };
    });

    return {
      ...this,
      integrations: filteredIntegrations,
    };
  }
}

export interface Integration {
  key: string;
  attributes: { [key: string]: string | number | null | boolean };
}

// ISO 4217 currency code
export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  SEK = 'SEK',
}
