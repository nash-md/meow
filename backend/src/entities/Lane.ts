import { ObjectId } from 'mongodb';
import { Entity } from '../helpers/EntityDecorator.js';
import { ExistingEntity, NewEntity } from './BaseEntity.js';
import { Board } from './Board.js';
import { Team } from './Team.js';

@Entity({ name: 'Lanes' })
export class Lane implements ExistingEntity {
  _id: ObjectId;
  teamId: ObjectId;
  boardId: ObjectId;
  name: string;
  index: number;
  inForecast: boolean;
  tags: Tags;
  color?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    _id: ObjectId,
    teamId: ObjectId,
    boardId: ObjectId,
    name: string,
    index: number,
    tags: Tags,
    inForecast: boolean,
    createdAt: Date,
    updatedAt: Date,
    color?: string
  ) {
    this._id = _id;
    this.teamId = teamId;
    this.boardId = boardId;
    this.name = name;
    this.index = index;
    this.tags = tags;
    this.inForecast = inForecast;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.color = color;
  }
}

@Entity({ name: 'Lanes' })
export class NewLane implements NewEntity {
  teamId: ObjectId;
  boardId: ObjectId;
  name: string;
  index: number;
  inForecast: boolean;
  tags: Tags;
  color: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    team: Team,
    board: Board,
    name: string,
    index: number,
    color: string = '',
    inForecast: boolean = false,
    tags: Tags = {}
  ) {
    this.teamId = team._id;
    this.boardId = board._id;
    this.name = name;
    this.index = index;
    this.color = color;
    this.inForecast = inForecast;
    this.tags = tags;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export interface Tags {
  [key: string]: string | boolean;
}

export enum LaneType {
  ClosedWon = 'closed-won',
  ClosedLost = 'closed-lost',
  Normal = 'normal',
}

export interface LaneRequest {
  _id: string | undefined;
  name: string;
  index: number;
  inForecast: boolean;
  tags?: Tags;
  color?: string;
}
