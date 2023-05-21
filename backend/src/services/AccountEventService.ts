import { DataSource } from 'typeorm';
import { Account } from '../entities/Account.js';
import { EventType } from '../entities/Event.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaType } from '../entities/Schema.js';
import {
  filterAttributeList,
  getAttributeListDifference,
} from '../helpers/AttributeHelper.js';

export class AccountEventService {
  database: DataSource;

  constructor(database: DataSource) {
    this.database = database;
  }

  async add(account: Account, user: User) {
    const event = new Event(
      account.teamId,
      account.id!.toString(),
      user.id!.toString(),
      EventType.Created
    );

    await this.database.manager.save(event);
  }

  // TODO remove any
  async update(body: Record<string, any>, account: Account, user: User) {
    const schema = await EntityHelper.findSchemaByType(
      account.teamId,
      SchemaType.Account
    );

    if (body.attributes) {
      const changes = getAttributeListDifference(
        account.attributes,
        body.attributes
      );

      const list = filterAttributeList(schema, changes);

      if (list.length !== 0) {
        const event = new Event(
          account.teamId,
          account.id!.toString(),
          user.id!.toString(),
          EventType.AttributeChanged,
          list
        );

        account.attributes = body.attributes;

        await this.database.manager.save(event);
      }
    }

    return account;
  }
}
