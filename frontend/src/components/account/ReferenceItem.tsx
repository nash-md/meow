import { useEffect, useState } from 'react';
import { Reference } from '../../interfaces/Reference';
import { Card } from '../../interfaces/Card';
import { DateTime } from 'luxon';
import { Currency } from '../Currency';
import { selectToken, store } from '../../store/Store';
import { useSelector } from 'react-redux';
import { getRequestClient } from '../../helpers/RequestHelper';
import { showCardLayer } from '../../actions/Actions';

export interface ReferenceItemProps {
  reference: Reference;
}

export const ReferenceItem = ({ reference }: ReferenceItemProps) => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [card, selectCard] = useState<Card | undefined>();

  useEffect(() => {
    const execute = async () => {
      const card = await client.getCard(reference._id);

      selectCard(card);
    };

    execute();
  }, [reference]);

  const openCard = (id?: string) => {
    store.dispatch(showCardLayer(id));
  };

  return (
    <div>
      {card && (
        <div className="reference" style={{ padding: '10px', fontSize: '1.2em' }}>
          <h4
            style={{ margin: 0, fontWeight: '600', color: 'var(--spectrum-global-color-gray-600)' }}
          >
            <span onClick={() => openCard(card._id)} className="direct-link">
              {card.name}
            </span>
          </h4>
          <div>Close Date: {DateTime.fromISO(card.closedAt!).toRelative()}</div>
          <div>
            Amount: <Currency value={card.amount} />
          </div>
        </div>
      )}
    </div>
  );
};
