import { AmountEvent } from '../../../interfaces/CardEvent';
import { Currency } from '../../Currency';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface AmountProps {
  event: AmountEvent;
}

export const Amount = ({ event }: AmountProps) => {
  const from = event.body.from ? parseInt(event.body.from.toString()) : 0;
  const to = event.body.to ? parseInt(event.body.to.toString()) : 0;

  return (
    <>
      {Translations.UpdatedOpportunitySize[DEFAULT_LANGUAGE]}{' '}
      <b>
        <Currency value={from} />
      </b>{' '}
      {Translations.OpportunityAmountTo[DEFAULT_LANGUAGE]}{' '}
      <b>
        <Currency value={to} />
      </b>
      {from > to && <>{Translations.OpportunityAmountDecrease[DEFAULT_LANGUAGE]} </>}
      {from < to && <>{Translations.OpportunityAmountIncrease[DEFAULT_LANGUAGE]} </>}
      <b>
        <Currency value={to - from} />
      </b>
    </>
  );
};
