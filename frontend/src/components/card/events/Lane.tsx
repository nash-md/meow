import { useSelector } from 'react-redux';
import { selectLanes } from '../../../store/Store';
import { DateTime } from 'luxon';
import { LaneEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface LaneProps {
  event: LaneEvent;
}

const durationInLane = (enter: string, exit: string) => {
  const start = DateTime.fromISO(enter);
  const end = DateTime.fromISO(exit);

  const duration = end.diff(start);

  const days = Math.round(duration.as('days'));
  const hours = Math.round(duration.as('hours'));
  const minutes = Math.round(duration.as('minutes'));

  if (days > 1) {
    return `${days} ${Translations.Days[DEFAULT_LANGUAGE]}`;
  }

  if (days === 1) {
    return `${days} ${Translations.Day[DEFAULT_LANGUAGE]}`;
  }

  if (hours > 1) {
    return `${hours} ${Translations.Hours[DEFAULT_LANGUAGE]}`;
  }

  if (hours === 1) {
    return `${hours} ${Translations.Hour[DEFAULT_LANGUAGE]}`;
  }

  if (minutes > 1) {
    return `${minutes} ${Translations.Minutes[DEFAULT_LANGUAGE]}`;
  }

  if (minutes === 1) {
    return `${minutes} ${Translations.Minute[DEFAULT_LANGUAGE]}`;
  }

  return Translations.LessThanAMinute[DEFAULT_LANGUAGE];
};

export const Lane = ({ event }: LaneProps) => {
  const lanes = useSelector(selectLanes);

  const laneFrom = lanes.find((lane) => lane._id === event.body.from);
  const laneTo = lanes.find((lane) => lane._id === event.body.to);

  return (
    <div className="body">
      {Translations.SetStageFrom[DEFAULT_LANGUAGE]} <b>{laneFrom?.name}</b> {Translations.OpportunityAmountTo[DEFAULT_LANGUAGE]} <b>{laneTo?.name}</b>
      {event.body.inLaneSince && (
        <span>
          {Translations.OpportunityWasInStage[DEFAULT_LANGUAGE]} <b>{laneFrom?.name}</b> {Translations.For[DEFAULT_LANGUAGE]}{' '}
          {durationInLane(event.body.inLaneSince, event.createdAt.toString())}
        </span>
      )}
    </div>
  );
};
