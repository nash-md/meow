import { useState } from 'react';

import Edit from '@spectrum-icons/workflow/Edit';
import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { DateTime } from 'luxon';
import { ItemTypes } from '../ItemTypes';
import { Card as CardEntity } from '../../interfaces/Card';
import { Lane } from '../../Constants';
import { store } from '../../store/Store';
import { ActionType } from '../../actions/Actions';

export interface CardProps {
  card: CardEntity;
  lane: Lane;
  moveCard: any;
}

export const Card = ({ card, lane, moveCard }: CardProps) => {
  const [ago, setAgo] = useState<string | null>(null);
  const [closedAt, setClosedAt] = useState<Date | undefined>();

  /* @ts-ignore */
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: card,
      end: (item, monitor) => {
        const dropResult: any = monitor.getDropResult();
        if (item && dropResult) {
          moveCard(item.id, dropResult.name);
        }
      },
    }),
    [card]
  );

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
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className="card"
    >
      {closedAt &&
        DateTime.fromJSDate(closedAt) < DateTime.now() &&
        lane?.isEnd !== true && <div className="overdue"></div>}
      <div className="content">
        <div className="edit">
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
        <div className="name">{card.name}</div>${card.amount} -{' '}
        {closedAt?.toLocaleDateString()}
        <div>
          <b>{ago}</b>
        </div>
      </div>
    </div>
  );
};
