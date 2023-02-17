import { Lane } from './Lane';
import { useSelector } from 'react-redux';
import { selectCards } from '../store/Store';
import { Lane as LaneInterface } from '../interfaces/Lane';

export interface BoardProps {
  lanes: LaneInterface[];
}

export const Board = ({ lanes }: BoardProps) => {
  const cards = useSelector(selectCards);

  return (
    <>
      {lanes
        .filter((lane) => lane.id !== 'trash')
        .map((lane) => {
          const list = cards.filter((card) => card.lane === lane.id);

          return (
            <Lane
              key={lane.id}
              lane={lane}
              cards={list}
              numberOfLanes={lanes.filter((lane) => lane.id !== 'trash').length}
            />
          );
        })}
    </>
  );
};
