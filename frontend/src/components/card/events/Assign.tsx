import { useSelector } from 'react-redux';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectUser } from '../../../store/Store';
import { CardEvent } from '../../../interfaces/CardEvent';

interface AssignProps {
  event: CardEvent;
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
