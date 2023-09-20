import { Lane } from './Lane';
import { Lane as LaneInterface } from '../interfaces/Lane';

export interface BoardProps {
  lanes: LaneInterface[];
}

export const Board = ({ lanes }: BoardProps) => {
  return (
    <>
      {lanes
        .filter((lane) => lane._id !== 'trash')
        .map((lane) => {
          return (
            <Lane
              key={lane._id}
              lane={lane}
              numberOfLanes={lanes.filter((lane) => lane._id !== 'trash').length}
            />
          );
        })}
    </>
  );
};
