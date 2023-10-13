import { useEffect, useState } from 'react';
import { Lane as LaneInterface, LaneStatistic } from '../interfaces/Lane';
import { StatisticLane } from './StatisticLane';
import { useSelector } from 'react-redux';
import { selectFilters, selectToken } from '../store/Store';
import { getRequestClient } from '../helpers/RequestHelper';

export interface BoardProps {
  lanes: LaneInterface[];
}

export interface BoardStatistics {
  active: LaneStatistic[];
  won: { count: number; amount: number; _id: string }[];
  lost: { count: number; amount: number; _id: string }[];
}
export const StatisticsBoard = ({ lanes }: BoardProps) => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [statistics, setStatistics] = useState<BoardStatistics | undefined>();

  const filters = useSelector(selectFilters);

  useEffect(() => {
    client
      .getLanesStatistic(filters)
      .then((payload) => {
        setStatistics(payload);
      })
      .catch((error) => console.error(error));
  }, [filters]);

  return (
    <>
      {lanes
        .filter((lane) => lane._id !== 'trash')
        .map((lane) => {
          return (
            <StatisticLane
              statistics={statistics}
              key={lane._id}
              lane={lane}
              numberOfLanes={lanes.filter((lane) => lane._id !== 'trash').length}
            />
          );
        })}
    </>
  );
};
