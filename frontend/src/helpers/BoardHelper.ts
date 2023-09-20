import { Card } from '../interfaces/Card';
import { Board } from '../interfaces/Board';

function move(
  card: Card,
  sourceLane: Card['_id'][],
  targetLane: Card['_id'][] | undefined,
  index?: number
): [Card['_id'][], Card['_id'][]] {
  const indexOnSourceLane = sourceLane.indexOf(card._id);

  if (indexOnSourceLane === -1) {
    throw new Error(`card with id ${card._id} not found in sourceLane array`);
  }

  const [removedCardId] = sourceLane.splice(indexOnSourceLane, 1);

  if (targetLane) {
    targetLane.splice(index !== undefined ? index : targetLane.length, 0, removedCardId);
  } else {
    targetLane = [card._id];
  }

  return [sourceLane, targetLane];
}

function remove(card: Card, board: Board): Board {
  const position = getPosition(card, board);

  if (!position) {
    throw new Error(`card with id ${card._id} not found in board array`);
  }

  const updated = { ...board };

  updated[position.laneId].splice(position.index, 1);

  return updated;
}

/* remove ids from board in case they are not existing in cards array */
function cleanUp(cards: Card[], board: Board): Board {
  const list = cards.map((card) => card._id);

  const updated: Board = {};

  for (const laneId in board) {
    updated[laneId] = board[laneId].filter((id) => list.includes(id));
  }

  return updated;
}

function add(card: Card, board: Board): void {
  if (board[card.laneId]) {
    board[card.laneId].push(card._id);
  } else {
    board[card.laneId] = [card._id];
  }
}

function isOnBoard(card: Card, board: Board | undefined): boolean {
  return board ? Object.values(board).some((lane) => lane.includes(card._id)) : false;
}

function isInCorrectLane(card: Card, board: Board | undefined): boolean {
  if (!board) {
    return true;
  }

  return (
    Object.entries(board).every(
      ([laneId, lane]) => !lane.includes(card._id) || laneId === card.laneId
    ) || false
  );
}

function getPosition(
  card: Card,
  board: Board | undefined
): { laneId: string; index: number } | undefined {
  for (const laneId in board) {
    const index = board[laneId].indexOf(card._id);

    if (index !== -1) {
      return { laneId: laneId, index: index };
    }
  }
}

export const BoardHelper = {
  add,
  move,
  remove,
  cleanUp,
  isOnBoard,
  isInCorrectLane,
  getPosition,
};
