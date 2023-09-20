import { useEffect, useState } from 'react';
import { Card } from '../interfaces/Card';

export const useLaneSummary = (cards: Card[]) => {
  const [sum, setSum] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cards.length);

    setSum(
      cards.reduce((acc, card) => {
        return card.amount ? acc + card.amount : acc;
      }, 0)
    );
  }, [cards]);

  return { sum, count };
};
