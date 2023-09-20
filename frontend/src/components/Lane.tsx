import { Card as CardComponent } from './Card';
import { Lane as LaneInterface, LaneType } from '../interfaces/Lane';
import { selectBoardByLaneId, selectCards, selectFilters, store } from '../store/Store';
import { Droppable } from 'react-beautiful-dnd';
import { showLaneLayer } from '../actions/Actions';
import { Currency } from './Currency';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../store/ApplicationStore';
import { LANE_COLOR } from '../Constants';
import { Card } from '../interfaces/Card';
import { Translations } from '../Translations';
import { CardHelper } from '../helpers/CardHelper';
import { useLaneSummary } from '../hooks/useLaneSummary';
import { useEffect, useState } from 'react';

const getLaneColorClassName = (color: string | undefined) => {
  if (color === LANE_COLOR.NEGATIVE) {
    return 'negative';
  }

  if (color === LANE_COLOR.POSITIVE) {
    return 'positive';
  }

  return '';
};

const getTitle = (count: number) => {
  return count === 1
    ? `${count} ${Translations.BoardTitle.en}`
    : `${count} ${Translations.BoardTitlePlural.en}`;
};

export interface LaneProps {
  lane: LaneInterface;
  numberOfLanes: number;
}

export const Lane = ({ lane, numberOfLanes }: LaneProps) => {
  const cards = useSelector(selectCards);
  const filters = useSelector(selectFilters);
  const ids = useSelector((store: ApplicationStore) => selectBoardByLaneId(store, lane._id));
  const [filtered, setFiltered] = useState<Card[]>([]);
  const { sum, count } = useLaneSummary(filtered);

  const openLane = (id?: string) => {
    store.dispatch(showLaneLayer(id));
  };

  useEffect(() => {
    setFiltered([...CardHelper.filterByLane(lane, cards, filters)]);
  }, [lane, cards, filters]);

  return (
    <div className="lane" style={{ width: `${100 / numberOfLanes}%` }}>
      <div
        className={`title ${getLaneColorClassName(lane.color)}`}
        onClick={() => openLane(lane._id)}
      >
        <div style={{ flexGrow: 1 }}>{lane.name}</div>
        {lane.inForecast === false && <div className="forecast-icon"></div>}
      </div>
      <div className={`sum ${getLaneColorClassName(lane.color)}`}>
        {getTitle(count)}-{' '}
        <b>
          <Currency value={sum} />
        </b>
      </div>
      <Droppable droppableId={lane._id}>
        {(provided, snaphot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`canvas ${snaphot.isDraggingOver ? 'drag-over' : ''} ${
                lane.tags?.type !== LaneType.Normal ? 'is-static' : ''
              }`}
            >
              {ids?.map((id, index) => {
                const card = filtered.find((listItem) => listItem._id === id);
                return card ? (
                  <CardComponent index={index} key={card._id} card={card} lane={lane} />
                ) : undefined;
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
