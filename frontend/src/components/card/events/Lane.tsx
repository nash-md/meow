import { lanes as defaults } from '../../../Constants';
import { Event } from '../../../interfaces/Event';

interface LaneProps {
  event: Event;
}

export const Lane = ({ event }: LaneProps) => {
  const laneFrom = defaults.find((lane) => lane.key === event.body.from);
  const laneTo = defaults.find((lane) => lane.key === event.body.to);

  return (
    <div>
      Set stage from <b>{laneFrom?.name}</b> to <b>{laneTo?.name}</b>
    </div>
  );
};
