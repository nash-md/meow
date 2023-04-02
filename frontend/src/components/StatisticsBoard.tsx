import { useContext, useEffect, useState } from 'react';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Lane as LaneInterface, LaneStatistic } from '../interfaces/Lane';
import { FilterMode } from '../pages/HomePage';
import { StatisticLane } from './StatisticLane';

export interface BoardProps {
  lanes: LaneInterface[];
  filters: Set<FilterMode>;
}

export interface BoardStatistics {
  active: LaneStatistic[];
  won: { count: number; amount: number; id: string }[];
  lost: { count: number; amount: number; id: string }[];
}
export const StatisticsBoard = ({ lanes, filters }: BoardProps) => {
  const { client } = useContext(RequestHelperContext);
  const [statistics, setStatistics] = useState<BoardStatistics | undefined>();

  useEffect(() => {
    if (client) {
      client
        .getLanesStatistic(filters)
        .then((payload) => {
          setStatistics(payload);
        })
        .catch((error) => console.error(error));
    }
  }, [filters]);

  return (
    <>
      {lanes
        .filter((lane) => lane.id !== 'trash')
        .map((lane) => {
          return (
            <StatisticLane
              statistics={statistics}
              key={lane.id}
              lane={lane}
              numberOfLanes={lanes.filter((lane) => lane.id !== 'trash').length}
            />
          );
        })}
    </>
  );
};
