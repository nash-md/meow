import { DataSource } from 'typeorm';
import { Card, CardAttribute } from '../entities/Card.js';
import { EventType } from '../entities/Event.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { Schema, SchemaType } from '../entities/Schema.js';
import { DateTime } from 'luxon';

interface CardAttributeChange {
  key: CardAttribute['key'];
  type: 'added' | 'updated' | 'removed';
  name?: string;
  value?: string | number | null | undefined;
}

function getAttributeListDifference(
  existing: CardAttribute | undefined,
  updated: CardAttribute | undefined
): CardAttributeChange[] {
  if (!existing && !updated) {
    return [];
  }

  if (!existing || !updated) {
    return [];
  }

  const list: CardAttributeChange[] = [];

  for (const key in existing) {
    let type = 'updated' as typeof list[number]['type'];

    if (existing[key] !== '' && updated[key] === '') {
      type = 'removed';
    }

    if (existing[key] === '' && updated[key] !== '') {
      type = 'added';
    }

    if (updated[key] !== existing[key]) {
      const item: CardAttributeChange = { key: key, type: type };

      if (updated[key] && updated[key] !== '') {
        item.value = updated[key];
      }

      list.push(item);
    }
  }

  for (const key in updated) {
    if (!existing.hasOwnProperty(key)) {
      list.push({ key: key, type: 'added', value: updated[key] });
    }
  }

  for (const key in existing) {
    if (!updated.hasOwnProperty(key)) {
      list.push({ key: key, type: 'removed', value: null });
    }
  }

  return list;
}

const filterAttributeList = (
  schema: Schema | null,
  list: CardAttributeChange[]
) => {
  if (!schema || list.length === 0) {
    return [];
  }

  const filtered = list
    .filter((item) => schema?.schema.find((a) => a.key === item.key))
    .map((item) => {
      const attribute = schema?.schema.find((a) => a.key === item.key);
      if (attribute) {
        return { ...item, name: attribute.name };
      }
    });

  return filtered;
};

export class CardEventService {
  database: DataSource;

  constructor(database: DataSource) {
    this.database = database;
  }

  async add(card: Card, user: User) {
    const event = new Event(
      card.teamId,
      card.id!.toString(),
      user.id!.toString(),
      EventType.CreatedAt
    );

    await this.database.manager.save(event);
  }

  async update(
    body: Record<string, any>,
    card: Card,
    user: User,
    updatedUser?: User
  ) {
    const schema = await EntityHelper.findSchemaByType(
      card.teamId,
      SchemaType.Card
    );

    if (body.attributes) {
      const changes = getAttributeListDifference(
        card.attributes,
        body.attributes
      );

      const list = filterAttributeList(schema, changes);

      if (list.length !== 0) {
        const event = new Event(
          card.teamId,
          card.id!.toString(),
          user.id!.toString(),
          EventType.Attribute,
          list
        );

        card.attributes = body.attributes;

        await this.database.manager.save(event);
      }
    }

    if (card.amount !== body.amount) {
      const event = new Event(
        card.teamId,
        card.id!.toString(),
        user.id!.toString(),
        EventType.Amount,
        {
          from: card.amount,
          to: body.amount,
        }
      );

      card.amount = body.amount;

      await this.database.manager.save(event);
    }

    if (body.closedAt) {
      const date = DateTime.fromISO(body.closedAt, {
        zone: 'utc',
      });
      if (
        date.toMillis() !==
        DateTime.fromJSDate(card.closedAt!, { zone: 'utc' }).toMillis()
      ) {
        const event = new Event(
          card.teamId,
          card.id!.toString(),
          user.id!.toString(),
          EventType.ClosedAt,
          {
            from: card.closedAt,
            to: date.toJSDate(),
          }
        );

        await this.database.manager.save(event);
      }

      card.closedAt = DateTime.fromISO(body.closedAt, {
        zone: 'utc',
      }).toJSDate();
    }

    if (updatedUser && updatedUser.id!.toString() !== card.userId.toString()) {
      const event = new Event(
        card.teamId,
        card.id!.toString(),
        user.id!.toString(),
        EventType.Assign,
        {
          from: card.userId,
          to: updatedUser.id,
        }
      );

      await this.database.manager.save(event);

      card.userId = updatedUser.id!.toString();
    }

    if (card.laneId !== body.laneId) {
      const event = new Event(
        card.teamId,
        card.id!.toString(),
        user.id!.toString(),
        EventType.Lane,
        {
          from: card.laneId,
          to: body.lane,
        }
      );

      await this.database.manager.save(event);
    }

    return card;
  }
}
