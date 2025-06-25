import { useSelector } from 'react-redux';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectUser } from '../../../store/Store';
import { AssignEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface AssignProps {
  event: AssignEvent;
}

export const Assign = ({ event }: AssignProps) => {
  const userFrom = useSelector((store: ApplicationStore) =>
    selectUser(store, event.body.from?.toString())
  );

  const userTo = useSelector((store: ApplicationStore) =>
    selectUser(store, event.body.to?.toString())
  );

  return (
    <>
      {Translations.AssignedOpportunityFrom[DEFAULT_LANGUAGE]} <b>{userFrom?.name}</b> {Translations.OpportunityAmountTo[DEFAULT_LANGUAGE]} <b>{userTo?.name}</b>
    </>
  );
};
