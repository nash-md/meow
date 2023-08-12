import { Lane } from '../entities/Lane.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { LaneEventPayload } from './EventStrategy.js';
import { log } from '../worker.js';
import { ForecastEvent } from '../entities/ForecastEvent.js';
import { TeamNotFoundError } from '../errors/TeamNotFoundError.js';
const updateForecastEvent = async (teamId: string, laneId: string, userId?: string) => {
  let event = await EntityHelper.findForecastEventByDay(teamId, laneId, new Date(), userId);

  const amount = await EntityHelper.getTotalAmountByLaneId(teamId, laneId, userId);

  if (event) {
    event.amount = amount;
  } else {
    event = new ForecastEvent(teamId, laneId, amount, userId);
  }
  await EntityHelper.persist(ForecastEvent, event);
};

export const LaneEventListener = {
  async onLaneUpdate({ teamId, laneId, userId }: LaneEventPayload) {
    log.debug(`execute onLaneUpdate for lane ${laneId} - userId: ${userId}`);

    const team = await EntityHelper.findTeamById(teamId);

    if (!team) {
      throw new TeamNotFoundError();
    }

    const lane = await EntityHelper.findOneById(team, Lane, laneId);

    /* update team */
    await updateForecastEvent(teamId, laneId);

    /* update user */
    await updateForecastEvent(teamId, laneId, userId);
  },
};
