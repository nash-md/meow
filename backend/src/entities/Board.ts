import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { ObjectId } from 'mongodb';
import { Team } from './Team.js';

@Entity({ name: 'Boards' })
export class Board implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(_id: ObjectId, teamId: ObjectId, name: string, createdAt: Date, updatedAt: Date) {
    this._id = _id;
    this.teamId = teamId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

@Entity({ name: 'Boards' })
export class NewBoard implements NewEntity {
  teamId: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(team: Team, name: string) {
    this.teamId = team._id!;
    this.name = name;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
