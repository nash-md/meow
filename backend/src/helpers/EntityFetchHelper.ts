import { Account } from '../entities/Account.js';
import { Card } from '../entities/Card.js';
import { Lane } from '../entities/Lane.js';
import { Team } from '../entities/Team.js';
import { User } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { InvalidRequestParameterError } from '../errors/InvalidRequestParameterError.js';
import { EntityHelper } from './EntityHelper.js';

export async function validateAndFetchCard(id: unknown, authenticatedUser: User): Promise<Card> {
  if (!id || typeof id !== 'string') {
    throw new InvalidRequestParameterError();
  }

  if (!EntityHelper.isValidEntityId(id)) {
    throw new EntityNotFoundError();
  }

  const card = await EntityHelper.findOneById(Card, id);

  if (!card || !EntityHelper.isEntityOwnedBy(card, authenticatedUser)) {
    throw new EntityNotFoundError();
  }

  return card;
}

export async function validateAndFetchLane(id: unknown, authenticatedUser: User): Promise<Lane> {
  if (!id || typeof id !== 'string') {
    throw new InvalidRequestParameterError();
  }

  if (!EntityHelper.isValidEntityId(id)) {
    throw new EntityNotFoundError();
  }

  const lane = await EntityHelper.findOneById(Lane, id);

  if (!lane || !EntityHelper.isEntityOwnedBy(lane, authenticatedUser)) {
    throw new EntityNotFoundError();
  }

  return lane;
}

export async function validateAndFetchUser(id: unknown, authenticatedUser: User): Promise<User> {
  if (!id || typeof id !== 'string') {
    throw new InvalidRequestParameterError();
  }

  if (!EntityHelper.isValidEntityId(id)) {
    throw new EntityNotFoundError();
  }

  const user = await EntityHelper.findOneById(User, id);

  if (!user || !EntityHelper.isEntityOwnedBy(user, authenticatedUser)) {
    throw new EntityNotFoundError();
  }

  return user;
}

export async function validateAndFetchAccount(
  id: unknown,
  authenticatedUser: User
): Promise<Account> {
  if (!id || typeof id !== 'string') {
    throw new InvalidRequestParameterError();
  }

  if (!EntityHelper.isValidEntityId(id)) {
    throw new EntityNotFoundError();
  }

  const account = await EntityHelper.findOneById(Account, id);

  if (!account || !EntityHelper.isEntityOwnedBy(account, authenticatedUser)) {
    throw new EntityNotFoundError();
  }

  return account;
}

export async function validateAndFetchTeam(id: unknown, user: User): Promise<Team> {
  if (!id || typeof id !== 'string') {
    throw new InvalidRequestParameterError();
  }

  if (!EntityHelper.isValidEntityId(id)) {
    throw new EntityNotFoundError();
  }

  const team = await EntityHelper.findOneById(Team, id);

  if (!team || !EntityHelper.isEntityOwnedBy(team, user)) {
    throw new EntityNotFoundError();
  }

  return team;
}
