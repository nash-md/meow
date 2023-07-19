import EventEmitter from 'node:events';
import { EventPayload, EventStrategy, EventType } from './EventStrategy.js';

export class NodeEventStrategy extends EventStrategy {
  emitter = new EventEmitter();

  constructor() {
    super();

    this.emitter = new EventEmitter();
  }

  emit(event: EventType, payload: EventPayload) {
    this.emitter.emit(event, payload);
  }

  register(event: EventType, listener: (payload: EventPayload) => unknown) {
    this.emitter.on(event, listener);
  }
}
