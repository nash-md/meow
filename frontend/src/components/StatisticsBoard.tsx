import { useContext, useEffect, useState } from 'react';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Lane as LaneInterface, LaneStatistic } from '../interfaces/Lane';
import { StatisticLane } from './StatisticLane';
import { useSelector } from 'react-redux';
import { selectFilters } from '../store/Store';

export interface BoardProps {
  lanes: LaneInterface[];
}

export interface BoardStatistics {
  active: LaneStatistic[];
  won: { count: number; amount: number; _id: string }[];
  lost: { count: number; amount: number; _id: string }[];
}
export const StatisticsBoard = ({ lanes }: BoardProps) => {
  const { client } = useContext(RequestHelperContext);
  const [statistics, setStatistics] = useState<BoardStatistics | undefined>();

  const filters = useSelector(selectFilters);

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
