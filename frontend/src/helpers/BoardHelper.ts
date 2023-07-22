import { Card } from '../interfaces/Card';
import { Board } from '../interfaces/Board';

function move(
  card: Card,
  from: Card['id'][],
  to: Card['id'][] | undefined,
  index?: number
): [Card['id'][], Card['id'][]] {
  const indexFrom = from.indexOf(card.id);

  if (indexFrom === -1) {
    throw new Error(`card with id ${card.id} not found in from array`);
  }

  const [removedCardId] = from.splice(indexFrom, 1);

  if (to) {
    to.splice(index !== undefined ? index : to.length, 0, removedCardId);
  } else {
    to = [card.id];
  }

  return [from, to];
}

function remove(card: Card, board: Board) {
  const position = getPosition(card, board);

  if (!position) {
    throw new Error(`card with id ${card.id} not found in from array`);
  }

  return board[position.laneId].splice(position.index);
}

function add(card: Card, board: Board) {
  if (board[card.laneId]) {
    board[card.laneId].push(card.id);
  } else {
    board[card.laneId] = [card.id];
  }
}

function isOnBoard(card: Card, board: Board | undefined): boolean {
  return board ? Object.values(board).some((lane) => lane.includes(card.id)) : false;
}

function isInCorrectLane(card: Card, board: Board | undefined): boolean {
  if (!board) {
    return true;
  }

  return (
    Object.entries(board).every(
      ([laneId, lane]) => !lane.includes(card.id) || laneId === card.laneId
    ) || false
  );
}

function getPosition(
  card: Card,
  board: Board | undefined
): { laneId: string; index: number } | undefined {
  for (const laneId in board) {
    const index = board[laneId].indexOf(card.id);

    if (index !== -1) {
      return { laneId: laneId, index: index };
    }
  }
}

export const BoardHelper = {
  add,
  move,
  remove,
  isOnBoard,
  isInCorrectLane,
  getPosition,
};
