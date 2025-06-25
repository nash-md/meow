import { NameEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface NameProps {
  event: NameEvent;
}

export const Name = ({ event }: NameProps) => {
  const from = event.body.from;
  const to = event.body.to;

  return (
    <>
      {Translations.NameChangedFrom[DEFAULT_LANGUAGE]} <b>{from} </b>{Translations.NameChangedTo[DEFAULT_LANGUAGE]} <b>{to}</b>
    </>
  );
};
