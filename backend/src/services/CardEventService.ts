import { DataSource } from 'typeorm';
import { Card } from '../entities/Card.js';
import { EventType } from '../entities/Event.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';

export class CardEventService {
  database: DataSource;

  constructor(database: DataSource) {
    this.database = database;
  }

  async add(card: Card, user: User) {
    const event = new Event(
      card.accountId,
      card.id!.toString(),
      user.id!.toString(),
      EventType.CreatedAt
    );

    await this.database.manager.save(event);
  }
}
