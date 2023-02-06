import { Event } from '../../../interfaces/Event';

interface AmountProps {
  event: Event;
}

export const Amount = ({ event }: AmountProps) => {
  return (
    <div>
      Updated opportunity size from <b>{event.body.from} </b> to{' '}
      <b>{event.body.to}</b>
    </div>
  );
};
