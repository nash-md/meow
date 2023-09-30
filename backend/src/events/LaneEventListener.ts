import { Lane } from '../entities/Lane.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { LaneEventPayload } from './EventStrategy.js';
import { log } from '../worker.js';
import { NewForecastEvent } from '../entities/ForecastEvent.js';
import { Team } from '../entities/Team.js';
import { ObjectId } from 'mongodb';
import { User } from '../entities/User.js';

const updateForecastEvent = async (teamId: ObjectId, laneId: ObjectId, userId?: ObjectId) => {
  let event = await EntityHelper.findForecastEventByDay(teamId, laneId, new Date(), userId);

  const amount = await EntityHelper.getTotalAmountByLaneId(teamId, laneId, userId);

  if (event) {
    event.amount = amount;

    await EntityHelper.update(event);
  } else {
    const lane = await EntityHelper.findOneByIdOrFail(Lane, laneId);

    let user: User | null = null;

    if (userId) {
      user = await EntityHelper.findOneBy(User, userId);
    }
    await EntityHelper.create(new NewForecastEvent(lane, amount, user ?? undefined));
  }
};

export const LaneEventListener = {
  async onLaneUpdate({ teamId, laneId, userId }: LaneEventPayload) {
    log.debug(`execute onLaneUpdate for lane ${laneId} - userId: ${userId}`);

    const team = await EntityHelper.findOneByIdOrFail(Team, teamId);

    /* update team */
    await updateForecastEvent(team._id, laneId);
    /* update user */
    await updateForecastEvent(team._id, laneId, userId);
  },
};
