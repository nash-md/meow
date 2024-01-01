import { CardEvent, CommentEvent } from '../../../interfaces/CardEvent';

interface CommentProps {
  event: CommentEvent;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <div className="comment">
      <div className="text">{event.body?.text}</div>
    </div>
  );
};
