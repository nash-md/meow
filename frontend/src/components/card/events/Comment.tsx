import { Event } from '../../../interfaces/Event';

interface CommentProps {
  event: Event;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <div className="comment">
      <div className="text">{event.body?.text}</div>
    </div>
  );
};
