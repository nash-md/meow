import { AccountEvent } from '../../../interfaces/AccountEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface NameProps {
  event: AccountEvent;
}

export const Name = ({ event }: NameProps) => {
  const from = event.body.from;
  const to = event.body.to;

  return (
    <div className="body">
      {Translations.NameChangedFrom[DEFAULT_LANGUAGE]} <b>{from} </b>{Translations.NameChangedTo[DEFAULT_LANGUAGE]} <b>{to}</b>
    </div>
  );
};
