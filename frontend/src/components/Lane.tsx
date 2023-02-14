import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Lane as LaneInterface } from '../interfaces/Lane';
import { Card as CardInterface } from '../interfaces/Card';
import { store } from '../store/Store';
import { Droppable } from 'react-beautiful-dnd';
import { ActionType } from '../actions/Actions';
import { Currency } from './Currency';

export interface LaneProps {
  lane: LaneInterface;
  cards: CardInterface[];
  numberOfLanes: number;
}

export const Lane = ({ lane, cards, numberOfLanes }: LaneProps) => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(
      cards.reduce((acc, card) => {
        return card.amount ? acc + card.amount : acc;
      }, 0)
    );
  }, [cards]);

  const showLaneDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'lane-detail', id: id },
    });
  };

  return (
    <div className="lane" style={{ width: `${100 / numberOfLanes}%` }}>
      <div
        className="title"
        onClick={() => showLaneDetail(lane.key)}
        style={{
          backgroundColor: lane.color ? lane.color : '#e6e6e6',
          color: lane.color ? 'white' : 'grey',
          display: 'flex',
        }}
      >
        <div style={{ flexGrow: 1 }}>{lane.name}</div>
        {lane.inForecast === false && (
          <div
            style={{
              marginRight: '4px',
              backgroundImage: lane.color
                ? 'url(/icon-hidden-white.svg)'
                : 'url(/icon-hidden.svg)',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '80%',
              width: '24px',
              opacity: '0.4',
            }}
          ></div>
        )}
      </div>

      <div
        style={{
          backgroundColor: lane.color ? lane.color : '#e6e6e6',
          padding: '5px',
          color: lane.color ? 'white' : 'grey',
        }}
      >
        {cards.length} Deal{cards.length > 1 ? 's' : ''} -{' '}
        <b>
          <Currency value={amount} />
        </b>
      </div>
      <Droppable droppableId={lane.key}>
        {(provided, snaphot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="canvas"
              style={{
                backgroundColor: snaphot.isDraggingOver ? '#F6F6F6' : 'white',
              }}
            >
              {cards
                .filter((card) => card.lane === lane.key)
                .map((card, index) => {
                  return (
                    <Card index={index} key={card.id} card={card} lane={lane} />
                  );
                })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
