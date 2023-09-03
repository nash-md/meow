import { useContext, useEffect, useState } from 'react';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { Reference } from '../../interfaces/Reference';
import { Card } from '../../interfaces/Card';
import { DateTime } from 'luxon';
import { Currency } from '../Currency';

export interface ReferenceItemProps {
  reference: Reference;
}

export const ReferenceItem = ({ reference }: ReferenceItemProps) => {
  const { client } = useContext(RequestHelperContext);
  const [card, selectCard] = useState<Card | undefined>();

  useEffect(() => {
    const execute = async () => {
      const card = await client!.getCard(reference.id);

      selectCard(card);
    };

    if (client) {
      execute();
    }
  }, [reference, client]);

  return (
    <div>
      {card && (
        <div style={{ padding: '10px', fontSize: '1.2em' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>{card.name}</h4>
          <div>Close Date: {DateTime.fromISO(card.closedAt!).toRelative()}</div>
          <div>
            Amount: <Currency value={card.amount} />
          </div>
        </div>
      )}
    </div>
  );
};
