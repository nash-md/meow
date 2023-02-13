import { Event } from '../../../interfaces/Event';
import { Avatar } from '../../Avatar';

interface CommentProps {
  event: Event;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <div className="comment">
      <Avatar id={event.userId} width={0} />
      <div className="text">{event.body?.text}</div>
    </div>
  );
};
