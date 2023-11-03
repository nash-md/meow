import { Lane } from '../entities/Lane.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { LaneEventPayload } from './EventStrategy.js';
import { log } from '../worker.js';
import { ObjectId } from 'mongodb';
import { User } from '../entities/User.js';
import { NewForecastLaneEvent } from '../entities/ForecastLaneEvent.js';

const updateLaneForecast = async (lane: Lane, userId?: ObjectId) => {
  let event = await EntityHelper.findForecastLaneEventByDay(
    lane.teamId,
    new Date(),
    lane._id,
    userId
  );

  const amount = await EntityHelper.getForecastByLaneId(lane.teamId, lane._id, userId);

  if (event) {
    event.amount = amount;

    await EntityHelper.update(event);
  } else {
    let user: User | null = null;

    if (userId) {
      user = await EntityHelper.findOneBy(User, userId);
    }

    await EntityHelper.create(new NewForecastLaneEvent(lane, amount, user ?? undefined));
  }
};

export const LaneEventListener = {
  async onLaneUpdate({ laneId, userId }: LaneEventPayload) {
    log.debug(`execute onLaneUpdate for lane ${laneId} - userId: ${userId}`);

    const lane = await EntityHelper.findOneByIdOrFail(Lane, laneId);

    /* update lane - team */
    await updateLaneForecast(lane);
    /* update lane - user */
    await updateLaneForecast(lane, userId);
  },
};
