import { useState } from 'react';

import Edit from '@spectrum-icons/workflow/Edit';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { ItemTypes } from './ItemTypes';
import { Card as CardEntity } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { selectCurrency, store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { Provider, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Currency } from './Currency';

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
      {(provided) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="card"
          >
            {closedAt &&
              DateTime.fromJSDate(closedAt) < DateTime.now() &&
              lane.inForecast !== true && <div className="overdue"></div>}
            <div
              className="content"
              onClick={() => {
                showCardDetail(card.id);
              }}
            >
              <div className="edit" style={{ display: 'none' }}>
                <button
                  onClick={() => {
                    showCardDetail(card.id);
                  }}
                >
                  <Edit
                    size="S"
                    UNSAFE_style={{ color: 'grey' }}
                    aria-label="Default Alert"
                  />
                </button>
              </div>
              <div className="name">{card.name}</div>{' '}
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
