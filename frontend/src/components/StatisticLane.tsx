import { useEffect, useMemo, useState } from 'react';
import { Lane, Lane as LaneInterface, LaneType } from '../interfaces/Lane';
import { selectCards, store } from '../store/Store';
import { showLaneLayer } from '../actions/Actions';
import { Currency } from './Currency';
import { useSelector } from 'react-redux';
import { LANE_COLOR } from '../Constants';
import { Card } from '../interfaces/Card';
import { Translations } from '../Translations';
import { BoardStatistics } from './StatisticsBoard';

const getLaneColorClassName = (color: string | undefined) => {
  if (color === LANE_COLOR.NEGATIVE) {
    return 'negative';
  }

  if (color === LANE_COLOR.POSITIVE) {
    return 'positive';
  }

  return '';
};

const toDays = (hours: number | undefined) => {
  if (!hours) {
    return '-';
  }

  return `${(hours / 24).toFixed(1).toString()} days`;
};

const getTitle = (cards: Card[], lane: LaneInterface) => {
  const count = cards.filter((card) => card.laneId === lane._id).length;

  return count === 1
    ? `${count} ${Translations.BoardTitle.en}`
    : `${count} ${Translations.BoardTitlePlural.en}`;
};

const getStatisticsByLane = (statistics: BoardStatistics | undefined, lane: Lane) => {
  if (!statistics) {
    return;
  }

  const active = statistics.active.find((l) => l._id === lane._id);
  const won = statistics.won.find((l) => l._id === lane._id);
  const lost = statistics.lost.find((l) => l._id === lane._id);

  return { active, won, lost };
};

export interface StatisticLaneProps {
  lane: LaneInterface;
  numberOfLanes: number;
  statistics: BoardStatistics | undefined;
}

export const StatisticLane = ({ lane, numberOfLanes, statistics }: StatisticLaneProps) => {
  const cards = useSelector(selectCards);
  const [amount, setAmount] = useState(0);

  const data = useMemo(() => {
    return getStatisticsByLane(statistics, lane);
  }, [lane, statistics]);

  useEffect(() => {
    if (!cards) {
      return;
    }

    setAmount(
      cards
        .filter((card) => card.laneId === lane._id)
        .reduce((acc, card) => {
          return card.amount ? acc + card.amount : acc;
        }, 0)
    );
  }, [cards]);

  const openLane = (id?: string) => {
    store.dispatch(showLaneLayer(id));
  };

  return (
    <div className="lane" style={{ width: `${100 / numberOfLanes}%` }}>
      <div
        className={`title ${getLaneColorClassName(lane.color)}`}
        onClick={() => openLane(lane._id)}
      >
        <div style={{ flexGrow: 1 }}>{lane.name}</div>
        {lane.inForecast === false && (
          <div
            className="forecast-icon"
            style={{
              backgroundImage: lane.color ? 'url(/icon-hidden-white.svg)' : 'url(/icon-hidden.svg)',
            }}
          ></div>
        )}
      </div>

      <div className={`sum ${getLaneColorClassName(lane.color)}`}>
        {getTitle(cards, lane)}-{' '}
        <b>
          <Currency value={amount} />
        </b>
      </div>
      <div className="canvas statistics-canvas">
        {lane.tags?.type === LaneType.Normal && data && (
          <div>
            <h4>Average Age</h4>
            <span>{toDays(data.active?.timeSinceCreationAvg)} </span>
            <h4>Average Time since Creation</h4>
            <span>{toDays(data.active?.timeInLaneAvg)} </span>
            <h4>Average Time to Close</h4>
            <span>{toDays(data.active?.cycleTimeAvg)} </span>

            <h4>Lost in this Stage</h4>
            <span>
              {data.lost?.count ? `${data.lost?.count} deals /` : '-'}
              {data.lost?.amount && <Currency value={data.lost?.amount} />}
            </span>

            <h4>Won in this Stage</h4>
            <span>
              {data.won?.count ? `${data.won?.count} deals /` : '-'}
              {data.won?.amount && <Currency value={data.won?.amount} />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
