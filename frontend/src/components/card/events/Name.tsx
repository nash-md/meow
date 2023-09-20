import { CardEvent } from '../../../interfaces/CardEvent';

interface NameProps {
  event: CardEvent;
}

export const Name = ({ event }: NameProps) => {
  const from = event.body.from;
  const to = event.body.to;

  return (
    <div className="body">
      Changed name from <b>{from} </b>to <b>{to}</b>
    </div>
  );
};
