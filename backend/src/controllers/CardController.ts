import { Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { Card, CardStatus, NewCard } from '../entities/Card.js';
import { Lane, LaneType } from '../entities/Lane.js';
import { InvalidCardPropertyError } from '../errors/InvalidCardPropertyError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { RequestParser } from '../helpers/RequestParser.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { EventHelper } from '../helpers/EventHelper.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { ObjectId } from 'mongodb';
import {
  validateAndFetchCard,
  validateAndFetchLane,
  validateAndFetchUser,
} from '../helpers/EntityFetchHelper.js';

function emitLaneEvent(teamId: ObjectId, laneId: ObjectId, userId: ObjectId) {
  EventHelper.get().emit('lane', {
    teamId,
    laneId,
    userId,
  });
}

function parseCardStatus(value: unknown): CardStatus {
  switch (value) {
    case 'active':
      return CardStatus.Active;
    case 'deleted':
      return CardStatus.Deleted;
    default:
      throw new InvalidCardPropertyError(`Unsupported status value: ${value}`);
  }
}

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cards = await EntityHelper.findCardsByTeam(req.jwt.team);

    return res.json(cards);
  } catch (error) {
    return next(error);
  }
};

const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let lane: Lane | null = null;

    const { body } = req;

    if (body.laneName) {
      const query = {
        teamId: req.jwt.team._id,
        name: body.laneName,
      };

      lane = await EntityHelper.findOneBy(Lane, query);
    }

    if (body.laneId) {
      lane = await EntityHelper.findOneById(Lane, body.laneId);
    }

    if (!lane || !EntityHelper.isEntityOwnedBy(lane, req.jwt.user)) {
      throw new EntityNotFoundError();
    }

    const card = new NewCard(req.jwt.user, lane, body.name, parseInt(body.amount));

    if (body.attributes) {
      card.attributes = body.attributes;
    }

    if (body.closedAt && RequestParser.isValidDateTimeString(body.closedAt)) {
      card.closedAt = RequestParser.toJsDate(body.closedAt);
    }

    if (body.nextFollowUpAt && RequestParser.isValidDateTimeString(body.nextFollowUpAt)) {
      card.nextFollowUpAt = RequestParser.toJsDate(body.nextFollowUpAt);
    }

    const updated = await EntityHelper.create(card, Card);

    EventHelper.get().emit('card', {
      user: req.jwt.user,
      card: updated!.toPlain(),
    });

    EventHelper.get().emit('lane', {
      teamId: card.teamId,
      userId: card.userId,
      laneId: card.laneId,
    });

    return res.status(201).json(updated);
  } catch (error) {
    return next(error);
  }
};

const get = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const card = await validateAndFetchCard(req.params.id, req.jwt.user);

    return res.json(card);
  } catch (error) {
    return next(error);
  }
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const card = await validateAndFetchCard(req.params.id, req.jwt.user);

    const original = card.toPlain();

    const { body } = req;

    card.name = body.name;

    let previousUserId = undefined;

    if (body.userId && card.userId.toString() !== body.userId.toString()) {
      const user = await validateAndFetchUser(body.userId, req.jwt.user);

      previousUserId = card.userId;

      card.userId = user._id!;
    }

    if (body.attributes) {
      card.attributes = body.attributes;
    }

    let previousAmount = undefined;

    if (card.amount !== parseInt(body.amount)) {
      previousAmount = card.amount;

      card.amount = parseInt(body.amount);
    }

    if (body.status) {
      card.status = parseCardStatus(req.body.status);
    }

    if (body.closedAt && !RequestParser.isEqualDates(body.closedAt, card.closedAt)) {
      const closedAt = RequestParser.toJsDate(body.closedAt);

      card.closedAt = closedAt;
    }

    if (
      body.nextFollowUpAt &&
      !RequestParser.isEqualDates(body.nextFollowUpAt, card.nextFollowUpAt)
    ) {
      const nextFollowUpAt = RequestParser.toJsDate(body.nextFollowUpAt);

      card.nextFollowUpAt = nextFollowUpAt;
    }

    let previousLaneId: ObjectId | undefined = undefined;

    if (body.laneId) {
      const lane = await validateAndFetchLane(body.laneId, req.jwt.user);

      if (body.laneId.toString() !== card.laneId.toString()) {
        previousLaneId = card.laneId;

        card.inLaneSince = new Date();
      }

      card.laneId = lane._id!;

      if (lane.tags?.type && lane.tags.type !== LaneType.Normal) {
        const closedAt = DateTime.utc().startOf('day');

        card.closedAt = closedAt.toJSDate();
      }
    }

    const updated = await EntityHelper.update(card);

    /* emit events */

    /* if lane has hanged emit events for the previous and current lane */
    if (previousLaneId) {
      emitLaneEvent(card.teamId, previousLaneId, card.userId);
      emitLaneEvent(card.teamId, card.laneId, card.userId);
    }

    /* if card has a changed amount update the lane and user */
    if (previousAmount) {
      emitLaneEvent(card.teamId, card.laneId, card.userId);
    }

    /* if card assignment has changed update lane and both users */
    if (previousUserId) {
      emitLaneEvent(card.teamId, card.laneId, previousUserId);
      emitLaneEvent(card.teamId, card.laneId, card.userId);
    }

    EventHelper.get().emit('card', { user: req.jwt.user, card: original, updated: card.toPlain() });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

export const CardController = {
  list,
  get,
  create,
  update,
};
