import { useEffect, useState } from 'react';
import { Card as CardComponent } from './Card';
import { Lane as LaneInterface, LaneType } from '../interfaces/Lane';
import {
  selectBoardByLaneId,
  selectCards,
  selectUserId,
  store,
} from '../store/Store';
import { Droppable } from 'react-beautiful-dnd';
import { ActionType } from '../actions/Actions';
import { Currency } from './Currency';
import { useSelector } from 'react-redux';
import { ApplicationStore } from '../store/ApplicationStore';
import { LANE_COLOR } from '../Constants';
import { FilterMode } from '../pages/HomePage';
import { Card } from '../interfaces/Card';
import { DateTime } from 'luxon';
import { Translations } from '../Translations';
import { CardHelper } from '../helpers/CardHelper';
import { useLaneSummary } from '../hooks/useLaneSummary';

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

const getCard = (
  lane: LaneInterface,
  cards: Card[],
  id: string,
  filters: Set<FilterMode>,
  userId?: string
) => {
  const card = cards.find((listItem) => listItem.id === id)!;

  if (!card) {
    return;
  }

  const updatedAt = card.closedAt
    ? DateTime.fromISO(card.updatedAt)
    : undefined;

  if (
    filters.has(FilterMode.RecentlyUpdated) &&
    updatedAt &&
    updatedAt < DateTime.now().startOf('day').minus({ days: 3 })
  ) {
    return;
  }

  if (filters.has(FilterMode.RequireUpdate) && lane.tags?.type !== 'normal') {
    return;
  }

  if (filters.has(FilterMode.RequireUpdate) && !CardHelper.isOverDue(card)) {
    return;
  }

  if (filters.has(FilterMode.OwnedByMe) && card.userId !== userId) {
    return;
  }

  return card;
};

export interface LaneProps {
  lane: LaneInterface;
  numberOfLanes: number;
  filters: Set<FilterMode>;
}

export const Lane = ({ lane, numberOfLanes, filters }: LaneProps) => {
  const cards = useSelector(selectCards);
  const userId = useSelector(selectUserId); // TODO a full session user should be part of the store

  const list = useSelector((store: ApplicationStore) =>
    selectBoardByLaneId(store, lane.id)
  );

  const { sum, count } = useLaneSummary(lane, cards);

  const showLaneDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'lane-detail', id: id },
    });
  };

  return (
    <div className="lane" style={{ width: `${100 / numberOfLanes}%` }}>
      <div
        className={`title ${getLaneColorClassName(lane.color)}`}
        onClick={() => showLaneDetail(lane.id)}
      >
        <div style={{ flexGrow: 1 }}>{lane.name}</div>
        {lane.inForecast === false && <div className="forecast-icon"></div>}
      </div>

      <div className={`sum ${getLaneColorClassName(lane.color)}`}>
        {getTitle(count)}-{' '}
        <b>
          ss
          <Currency value={sum} />
        </b>
      </div>
      <Droppable droppableId={lane.id}>
        {(provided, snaphot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`canvas ${snaphot.isDraggingOver ? 'drag-over' : ''} ${
                lane.tags?.type !== LaneType.Normal ? 'is-static' : ''
              }`}
            >
              {list?.map((id, index) => {
                const card = getCard(lane, cards, id, filters, userId);

                return card ? (
                  <CardComponent
                    index={index}
                    key={card.id}
                    card={card}
                    lane={lane}
                  />
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
