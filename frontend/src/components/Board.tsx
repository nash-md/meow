import { Lane } from './Lane';
import { Lane as LaneInterface } from '../interfaces/Lane';
import { FilterMode } from '../pages/HomePage';

export interface BoardProps {
  lanes: LaneInterface[];
  filters: Set<FilterMode>;
}

export const Board = ({ lanes, filters }: BoardProps) => {
  return (
    <>
      {lanes
        .filter((lane) => lane.id !== 'trash')
        .map((lane) => {
          return (
            <Lane
              filters={filters}
              key={lane.id}
              lane={lane}
              numberOfLanes={lanes.filter((lane) => lane.id !== 'trash').length}
            />
          );
        })}
    </>
  );
};
