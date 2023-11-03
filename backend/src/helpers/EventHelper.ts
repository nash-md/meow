import { ObjectId } from 'mongodb';
import { EventStrategy } from '../events/EventStrategy.js';
import { PlainCard } from '../entities/Card.js';
import { User } from '../entities/User.js';

let emitter: EventStrategy;

const set = (strategy: EventStrategy) => {
  emitter = strategy;
};

const get = () => {
  return emitter;
};

export const EventHelper = {
  set,
  get,
};

export function emitLaneEvent(laneId: ObjectId, userId?: ObjectId) {
  EventHelper.get().emit('lane', {
    laneId,
    userId,
  });
}

export function emitBoardEvent(boardId: ObjectId, userId?: ObjectId) {
  EventHelper.get().emit('board', {
    boardId,
    userId,
  });
}

export function emitCardEvent(user: User, latest: PlainCard, previous?: PlainCard) {
  EventHelper.get().emit('card', {
    user,
    latest,
    previous,
  });
}
