import { useEffect, useState } from 'react';
import { Card } from './card/Card';
import { ItemTypes } from './ItemTypes';
import { useDrop } from 'react-dnd';
import { Lane as LaneInterface } from '../Constants';
import { Card as CardInterface } from '../interfaces/Card';

export interface LaneProps {
  moveCard: any;
  lane: LaneInterface;
  cards: CardInterface[];
  numberOfLanes: number;
}

export const Lane = ({ moveCard, lane, cards, numberOfLanes }: LaneProps) => {
  const [amount, setAmount] = useState(0);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: () => ({ name: lane.key }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  useEffect(() => {
    setAmount(
      cards.reduce((acc, card) => {
        return acc + card.amount;
      }, 0)
    );
  }, [cards]);

  return (
    <div className="lane" style={{ width: `${100 / numberOfLanes}%` }}>
      <div
        className="title"
        style={{
          backgroundColor: lane.color ?? '#e6e6e6',
          color: lane.color ? 'white' : 'grey',
        }}
      >
        {lane.name}
      </div>

      <div
        style={{
          backgroundColor: lane.color ?? '#e6e6e6',
          padding: '5px',
          color: lane.color ? 'white' : 'grey',
        }}
      >
        {cards.length} Deal{cards.length > 1 ? 's' : ''} - <b>${amount}</b>
      </div>

      <div
        className="canvas"
        ref={drop}
        style={{
          backgroundColor: isOver ? '#F6F6F6' : 'white',
        }}
      >
        {cards
          .filter((card) => card.lane === lane.key)
          .map((card) => {
            return (
              <Card key={card.id} card={card} moveCard={moveCard} lane={lane} />
            );
          })}
      </div>
    </div>
  );
};
