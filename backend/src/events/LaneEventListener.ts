import { EventType } from '../entities/Event.js';
import { Lane } from '../entities/Lane.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { LaneEventPayload } from './EventStrategy.js';
import { EventType as CardEventType, Event } from '../entities/Event.js';
import { log } from '../worker.js';

export const LaneEventListener = {
  async onLaneUpdate({ laneId, user }: LaneEventPayload) {
    log.debug(`execute onLaneUpdate for lane ${laneId}`);

    const userId = user.id!.toString();

    const { teamId } = user;

    const lane = await EntityHelper.findOneById(user, Lane, laneId);

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
      event = new Event(lane.teamId, lane.id!.toString(), userId, CardEventType.LaneAmountChanged, {
        amount: amount,
      });
    }

    await EntityHelper.persist(Event, event);
  },
};
