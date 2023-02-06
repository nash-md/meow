import { useDragDropManager } from 'react-dnd';
import { Lane } from './Lane';
import { Trash } from './Trash';
import { useSelector } from 'react-redux';
import { useState, useEffect, useContext } from 'react';
import { selectCards, store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { Lane as LaneInterface, LaneKey } from '../Constants';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';

export interface BoardProps {
  lanes: LaneInterface[];
}

export const Board = ({ lanes }: BoardProps) => {
  const { client } = useContext(RequestHelperContext);

  const cards = useSelector(selectCards);
  const dragDropManager = useDragDropManager();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dragDropManager.getMonitor().subscribeToStateChange(handleMonitorChange);
  }, []);

  const handleMonitorChange = () => {
    setIsDragging(dragDropManager.getMonitor().isDragging());
  };

  // TODO should be a redux action
  const moveCard = async (id: string, key: LaneKey) => {
    console.log(`move card ${id} to lane ${key}`);

    const card = cards.find((card) => card.id === id);

    if (card) {
      if (key === 'trash') {
        await client!.deleteCard(card!.id);

        store.dispatch({
          type: ActionType.CARD_DELETE,
          payload: card!.id,
        });
      } else {
        card!.lane = key;

        await client!.updateCard(card);

        store.dispatch({
          type: ActionType.CARD_UPDATE,
          payload: card,
        });
      }
    }
  };

  return (
    <>
      {lanes
        .filter((lane) => lane.key !== 'trash')
        .map((lane) => {
          const list = cards.filter((card) => card.lane === lane.key);

          return (
            <Lane
              key={lane.key}
              moveCard={moveCard}
              lane={lane}
              cards={list}
              numberOfLanes={
                lanes.filter((lane) => lane.key !== 'trash').length
              }
            />
          );
        })}
      {isDragging && <Trash isDragging={isDragging} />}
    </>
  );
};
