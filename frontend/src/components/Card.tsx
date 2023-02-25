import { useState } from 'react';
import Edit from '@spectrum-icons/workflow/Edit';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { Card as CardEntity } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { Draggable } from 'react-beautiful-dnd';
import { Currency } from './Currency';
import { Avatar } from './Avatar';

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
      setAgo('not set');
    }

    if (card && card.closedAt) {
      setClosedAt(DateTime.fromISO(card.closedAt).toJSDate());
    }
  }, [card]);

  const showCardDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'card-detail', id: id },
    });
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snaphot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="card"
          >
            {closedAt &&
              DateTime.fromJSDate(closedAt) < DateTime.now() &&
              lane.inForecast === true && <div className="overdue"></div>}
            <div
              className={`content ${snaphot.isDragging ? 'is-dragging' : ''}`}
              onClick={() => {
                showCardDetail(card.id);
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                <Avatar width={30} id={card.userId} />
              </div>
              <div className="name">{card.name}</div>
              <Currency value={card.amount} /> -{' '}
              {closedAt?.toLocaleDateString()}
              <div>
                <b>{ago}</b>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
