import { CardStatus } from '../entities/Card.js';
import { Lane, LaneType } from '../entities/Lane.js';
import { DatabaseHelper } from '../helpers/DatabaseHelper.js';
import { ObjectId } from 'mongodb';
import { EntityHelper } from '../helpers/EntityHelper.js';

export class ForecastService {
  async getByLaneType(
    type: LaneType,
    teamId: ObjectId,
    start: Date,
    end: Date,
    userId?: ObjectId
  ): Promise<{ amount: number; count: number }> {
    const direct = DatabaseHelper.get();
    const collection = direct.collection('Cards');

    const query: any = {
      teamId: teamId,
      tags: {
        type: type,
      },
    };

    if (type === LaneType.Normal) {
      query.inForecast = true;
    }

    const lanes = await EntityHelper.findBy(Lane, query);
    const match: any = {
      $match: {
        teamId: { $eq: teamId },
        status: { $ne: CardStatus.Deleted },
        laneId: { $in: lanes.map((lane) => lane._id) },
        closedAt: {
          $gt: start,
          $lt: end,
        },
      },
    };

    if (userId) {
      match.$match.userId = userId;
    }

    const group = {
      $group: {
        _id: null,
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    };

    const cursor = await collection.aggregate([match, group]);

    const list = await cursor.toArray();

    const payload = list[0]
      ? { amount: list[0].amount, count: list[0].count }
      : { amount: 0, count: 0 };

    return payload;
  }
}
