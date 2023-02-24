import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Lane as LaneInterface } from '../interfaces/Lane';
import { selectBoardByLaneId, selectCards, store } from '../store/Store';
import { Droppable } from 'react-beautiful-dnd';
import { ActionType } from '../actions/Actions';
import { Currency } from './Currency';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../store/ApplicationStore';

export interface LaneProps {
  lane: LaneInterface;
  numberOfLanes: number;
}

export const Lane = ({ lane, numberOfLanes }: LaneProps) => {
  const cards = useSelector(selectCards);

  const list = useSelector((store: ApplicationStore) =>
    selectBoardByLaneId(store, lane.id)
  );

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!cards) {
      return;
    }

    setAmount(
      cards
        .filter((card) => card.laneId === lane.id)
        .reduce((acc, card) => {
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
        onClick={() => showLaneDetail(lane.id)}
        style={{
          backgroundColor: lane.color ? lane.color : '#e6e6e6',
          color: lane.color ? 'white' : 'grey',
          display: 'flex',
        }}
      >
        <div style={{ flexGrow: 1 }}>{lane.name}</div>
        {lane.inForecast === false && (
          <div
            className="forecast-icon"
            style={{
              backgroundImage: lane.color
                ? 'url(/icon-hidden-white.svg)'
                : 'url(/icon-hidden.svg)',
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
        {cards.filter((card) => card.laneId === lane.id).length} Deal
        {cards.filter((card) => card.laneId === lane.id).length > 1
          ? 's'
          : ''}{' '}
        -{' '}
        <b>
          <Currency value={amount} />
        </b>
      </div>
      <Droppable droppableId={lane.id}>
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
              {list?.map((id, index) => {
                const card = cards.find((listItem) => listItem.id === id)!;

                if (!card) {
                  return;
                }

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
