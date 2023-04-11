import { useEffect, useState } from 'react';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';

export const useLaneSummary = (lane: Lane, cards: Card[]) => {
  const [sum, setSum] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!cards || !lane) {
      return;
    }

    setCount(cards.filter((card) => card.laneId === lane.id).length);

    setSum(
      cards
        .filter((card) => card.laneId === lane.id)
        .reduce((acc, card) => {
          return card.amount ? acc + card.amount : acc;
        }, 0)
    );
  }, [cards, lane]);

  return { sum, count };
};
