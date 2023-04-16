import { Card as CardComponent } from './Card';
import { Lane as LaneInterface, LaneType } from '../interfaces/Lane';
import {
  selectBoardByLaneId,
  selectCards,
  selectFilters,
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
  filters: { mode: Set<FilterMode>; text?: string },
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
    filters.mode.has(FilterMode.RecentlyUpdated) &&
    updatedAt &&
    updatedAt < DateTime.now().startOf('day').minus({ days: 3 })
  ) {
    return;
  }

  if (
    filters.mode.has(FilterMode.RequireUpdate) &&
    lane.tags?.type !== 'normal'
  ) {
    return;
  }

  if (
    filters.mode.has(FilterMode.RequireUpdate) &&
    !CardHelper.isOverDue(card)
  ) {
    return;
  }

  if (filters.mode.has(FilterMode.OwnedByMe) && card.userId !== userId) {
    return;
  }

  if (filters.text) {
    const regex = new RegExp(`${filters.text}`, 'i');

    if (regex.test(lane.name)) {
      return card;
    }

    if (!regex.test(card.name)) {
      return;
    }
  }

  return card;
};

export interface LaneProps {
  lane: LaneInterface;
  numberOfLanes: number;
}

export const Lane = ({ lane, numberOfLanes }: LaneProps) => {
  const cards = useSelector(selectCards);
  const userId = useSelector(selectUserId); // TODO a full session user should be part of the store
  const filters = useSelector(selectFilters);

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
