import { EntityHelper } from '../helpers/EntityHelper.js';
import { BoardEventPayload } from './EventStrategy.js';
import { log } from '../worker.js';
import { Team } from '../entities/Team.js';
import { ObjectId } from 'mongodb';
import { User } from '../entities/User.js';
import { NewForecastTotalEvent } from '../entities/ForecastTotalEvent.js';
import { Board } from '../entities/Board.js';

const updateForecast = async (board: Board, userId?: ObjectId) => {
  let event = await EntityHelper.findForecastEventByDay(board.teamId, new Date(), userId);

  const amount = await EntityHelper.getForecast(board.teamId, userId);

  if (event) {
    event.amount = amount;

    await EntityHelper.update(event);
  } else {
    let user: User | null = null;

    if (userId) {
      user = await EntityHelper.findOneBy(User, userId);
    }

    const team = await EntityHelper.findOneByIdOrFail(Team, board.teamId);

    await EntityHelper.create(new NewForecastTotalEvent(team, amount, user ?? undefined));
  }
};

export const BoardEventListener = {
  async onBoardEvent({ boardId, userId }: BoardEventPayload) {
    log.debug(`execute onBoardEvent board ${boardId} - userId: ${userId}`);

    const board = await EntityHelper.findOneByIdOrFail(Board, boardId);

    /* update lane - team */
    await updateForecast(board);
    /* update lane - user */
    await updateForecast(board, userId);
  },
};
