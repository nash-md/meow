import { EventStrategy } from '../events/EventStrategy.js';

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
