import { useSelector } from 'react-redux';
import { Event } from '../../../interfaces/Event';
import { selectLanes, store } from '../../../store/Store';

interface LaneProps {
  event: Event;
}

export const Lane = ({ event }: LaneProps) => {
  const lanes = useSelector(selectLanes);

  const laneFrom = lanes.find((lane) => lane.id === event.body.from);
  const laneTo = lanes.find((lane) => lane.id === event.body.to);

  return (
    <div>
      Set stage from <b>{laneFrom?.name}</b> to <b>{laneTo?.name}</b>
    </div>
  );
};
