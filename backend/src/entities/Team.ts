import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';

@Entity({ name: 'Teams' })
export class Team implements ExistingEntity {
    _id: ObjectId;
    name: string;
    currency: CurrencyCode;
    integrations?: Integration[];
    isFirstTeam?: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: ObjectId,
        name: string,
        currency: CurrencyCode,
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id = _id;
        this.name = name;
        this.currency = currency;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        if (!this.integrations)
            return {
                ...this,
                integrations: [],
            };

        const filteredIntegrations = this.integrations.map((integration) => {
            return { key: integration.key };
        });

        return {
            ...this,
            integrations: filteredIntegrations,
        };
    }

    findIntegrationByKey(key: string) {
        return this.integrations?.find(
            (integration) => integration.key === key // TODO add enum
        );
    }
}

@Entity({ name: 'Teams' })
export class NewTeam implements NewEntity {
    name: string;
    currency: CurrencyCode;
    isFirstTeam?: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(name: string, currency: CurrencyCode, isFirstTeam?: boolean) {
        this.name = name;
        this.currency = currency;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        if (isFirstTeam) {
            this.isFirstTeam = isFirstTeam;
        }
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
    MT2 = 'MT2',
    GBP = 'GBP',
}
