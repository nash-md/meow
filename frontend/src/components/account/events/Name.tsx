import { AccountEvent } from '../../../interfaces/AccountEvent';

interface NameProps {
  event: AccountEvent;
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
