import { DatabaseHelper } from '../helpers/DatabaseHelper.js';
import { ObjectId } from 'mongodb';
import { EventType } from '../entities/EventType.js';

export class ActivityService {
  async get(
    teamId: ObjectId,
    start: Date
  ): Promise<
    {
      _id: ObjectId;
      cardId: ObjectId;
      cardName: string;
      type: EventType;
      userId: ObjectId;
      userName: string;
      createdAt: Date;
      laneId: ObjectId;
      laneName: string;
    }[]
  > {
    const direct = DatabaseHelper.get();
    const collection = direct.collection('Events');

    const types = Object.values(EventType).filter(
      (type) => type !== EventType.ForecastTotal && type !== EventType.ForecastCard
    );

    const match: any = {
      $match: {
        teamId: { $eq: teamId },
        createdAt: { $gte: start },
        type: { $in: types },
      },
    };

    const lookupCard = {
      $lookup: {
        from: 'Cards',
        localField: 'cardId',
        foreignField: '_id',
        as: 'card',
      },
    };

    const unwindCard = {
      $unwind: '$card',
    };

    const lookupUser = {
      $lookup: {
        from: 'Users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    };

    const unwindUser = {
      $unwind: '$user',
    };

    const project = {
      $project: {
        _id: 1,
        teamId: 1,
        cardId: 1,
        cardName: '$card.name',
        userId: 1,
        userName: '$user.name',
        type: 1,
        createdAt: 1,
        updatedAt: 1,
        body: 1,
      },
    };

    const sort = { $sort: { createdAt: -1 } };

    const cursor = await collection.aggregate([
      match,
      lookupCard,
      unwindCard,
      lookupUser,
      unwindUser,
      project,
      sort,
    ]);

    const list = (await cursor.toArray()) as any;

    return list;
  }
}
