import { useSelector } from 'react-redux';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectUser } from '../../../store/Store';
import { AssignEvent } from '../../../interfaces/CardEvent';

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
      Assigned opportunity from <b>{userFrom?.name}</b> to <b>{userTo?.name}</b>
    </>
  );
};
