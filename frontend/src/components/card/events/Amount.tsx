import { CardEvent } from '../../../interfaces/CardEvent';
import { Currency } from '../../Currency';

interface AmountProps {
  event: CardEvent;
}

export const Amount = ({ event }: AmountProps) => {
  const from = event.body.from ? parseInt(event.body.from.toString()) : 0;
  const to = event.body.to ? parseInt(event.body.to.toString()) : 0;

  return (
    <div className="body">
      Updated opportunity size from{' '}
      <b>
        <Currency value={from} />
      </b>{' '}
      to{' '}
      <b>
        <Currency value={to} />
      </b>
      {from > to && <>. This is an decrease of </>}
      {from < to && <>. This is an increase of </>}
      <b>
        <Currency value={to - from} />
      </b>
    </div>
  );
};
