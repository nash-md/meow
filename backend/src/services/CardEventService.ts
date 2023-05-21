import { DataSource } from 'typeorm';
import { Card } from '../entities/Card.js';
import { EventType } from '../entities/Event.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { SchemaType } from '../entities/Schema.js';
import { RequestParser } from '../helpers/RequestParser.js';
import {
  filterAttributeList,
  getAttributeListDifference,
} from '../helpers/AttributeHelper.js';

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
      EventType.Created
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
          EventType.AttributeChanged,
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
        EventType.AmountChanged,
        {
          from: card.amount,
          to: parseInt(body.amount),
        }
      );

      card.amount = body.amount;

      await this.database.manager.save(event);
    }

    if (
      body.closedAt &&
      !RequestParser.isEqualDates(body.closedAt, card.closedAt)
    ) {
      const closedAt = RequestParser.toJsDate(body.closedAt);

      const event = new Event(
        card.teamId,
        card.id!.toString(),
        user.id!.toString(),
        EventType.ClosedAtChanged,
        {
          from: card.closedAt,
          to: closedAt,
        }
      );

      await this.database.manager.save(event);

      card.closedAt = closedAt;
    }

    if (
      body.nextFollowUpAt &&
      !RequestParser.isEqualDates(body.nextFollowUpAt, card.nextFollowUpAt)
    ) {
      const nextFollowUpAt = RequestParser.toJsDate(body.nextFollowUpAt);

      const event = new Event(
        card.teamId,
        card.id!.toString(),
        user.id!.toString(),
        EventType.NextFollowUpAtChanged,
        {
          from: card.nextFollowUpAt,
          to: nextFollowUpAt,
        }
      );

      await this.database.manager.save(event);

      card.nextFollowUpAt = nextFollowUpAt;
    }

    if (updatedUser && updatedUser.id!.toString() !== card.userId.toString()) {
      const event = new Event(
        card.teamId,
        card.id!.toString(),
        user.id!.toString(),
        EventType.Assigned,
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
        EventType.LaneMoved,
        {
          from: card.laneId,
          to: body.laneId,
          inLaneSince: card.inLaneSince,
        }
      );

      await this.database.manager.save(event);
    }

    return card;
  }

  async storeLaneAmountChange(teamId: string, userId: string, laneId: string) {
    const amount = await EntityHelper.getTotalAmountByLaneId(teamId, laneId);

    let event = await EntityHelper.findEventByTypeAndDay(
      teamId,
      laneId,
      EventType.LaneAmountChanged,
      new Date()
    );

    if (event) {
      event.body = {
        amount: amount,
      };
    } else {
      event = new Event(teamId, laneId, userId, EventType.LaneAmountChanged, {
        amount: amount,
      });
    }

    await this.database.manager.save(event);
  }
}
