import { useState } from 'react';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { Card as CardEntity } from '../interfaces/Card';
import { Lane, LaneType } from '../interfaces/Lane';
import { store } from '../store/Store';
import { showCardLayer } from '../actions/Actions';
import { Draggable } from 'react-beautiful-dnd';
import { Currency } from './Currency';
import { Avatar } from './Avatar';
import { CardHelper } from '../helpers/CardHelper';
import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export interface CardProps {
  card: CardEntity;
  lane: Lane;
  index: number;
}

export const Card = ({ card, lane, index }: CardProps) => {
  const [ago, setAgo] = useState<string | null>(null);
  const [closedAt, setClosedAt] = useState<Date | undefined>();

  useEffect(() => {
    if (card && card.updatedAt) {
      const ago = DateTime.fromISO(card.updatedAt).toRelative();

      setAgo(ago);
    } else {
      setAgo(Translations.NotSetLabel[DEFAULT_LANGUAGE]);
    }

    if (card && card.closedAt) {
      setClosedAt(DateTime.fromISO(card.closedAt).toJSDate());
    }
  }, [card]);

  const openCard = (id?: string) => {
    store.dispatch(showCardLayer(id));
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snaphot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="card"
          >
            {CardHelper.isOverDue(card) && lane.inForecast && (
              <div className="overdue"></div>
            )}
            <div
              className={`content ${snaphot.isDragging ? 'is-dragging' : ''}`}
              onClick={() => {
                openCard(card._id);
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                <Avatar width={30} id={card.userId} />
              </div>
              <div className="name">{card.name}</div>

              {lane.tags?.type == LaneType.Normal && (
                <>
                  <span style={{ fontSize: '1.1em' }}>
                    <Currency value={card.amount} /> - {closedAt?.toLocaleDateString()}
                  </span>
                  <div>
                    <b>{ago}</b>
                  </div>
                </>
              )}

              {lane.tags?.type !== LaneType.Normal && (
                <>
                  <span style={{ fontSize: '1.1em' }}>
                    <Currency value={card.amount} />
                  </span>
                  <div>
                    <span style={{ fontWeight: '700' }}>
                      {Translations.ClosedLabel[DEFAULT_LANGUAGE]} {DateTime.fromISO(card.closedAt!).toRelative()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
