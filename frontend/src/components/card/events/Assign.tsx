import { useSelector } from 'react-redux';
import { Event } from '../../../interfaces/Event';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectUser } from '../../../store/Store';

interface AssignProps {
  event: Event;
}

export const Assign = ({ event }: AssignProps) => {
  const userFrom = useSelector((store: ApplicationStore) =>
    selectUser(store, event.body.from?.toString())
  );

  const userTo = useSelector((store: ApplicationStore) =>
    selectUser(store, event.body.to?.toString())
  );

  return (
    <div className="body">
      Assigned opportunity from <b>{userFrom?.name}</b> to <b>{userTo?.name}</b>
    </div>
  );
};
