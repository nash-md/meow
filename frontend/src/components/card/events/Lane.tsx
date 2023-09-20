import { useSelector } from 'react-redux';
import { selectLanes } from '../../../store/Store';
import { DateTime } from 'luxon';
import { CardEvent } from '../../../interfaces/CardEvent';

interface LaneProps {
  event: CardEvent;
}

const durationInLane = (enter: string, exit: string) => {
  const start = DateTime.fromISO(enter);
  const end = DateTime.fromISO(exit);

  const duration = end.diff(start);

  const days = Math.round(duration.as('days'));
  const hours = Math.round(duration.as('hours'));
  const minutes = Math.round(duration.as('minutes'));

  if (days > 1) {
    return `${days} days`;
  }

  if (days === 1) {
    return `${days} days`;
  }

  if (hours > 1) {
    return `${hours} hours`;
  }

  if (hours === 1) {
    return `${hours} hour`;
  }

  if (minutes > 1) {
    return `${minutes} minutes`;
  }

  if (hours === 1) {
    return `${hours} minute`;
  }

  return `less than a minute`;
};

export const Lane = ({ event }: LaneProps) => {
  const lanes = useSelector(selectLanes);

  const laneFrom = lanes.find((lane) => lane._id === event.body.from);
  const laneTo = lanes.find((lane) => lane._id === event.body.to);

  return (
    <div className="body">
      Set stage from <b>{laneFrom?.name}</b> to <b>{laneTo?.name}</b>
      {event.body.inLaneSince && (
        <span>
          . The opportunity was in stage <b>{laneFrom?.name}</b> for{' '}
          {durationInLane(event.body.inLaneSince, event.createdAt.toString())}
        </span>
      )}
    </div>
  );
};
