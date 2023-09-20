import { CardEvent } from '../../../interfaces/CardEvent';

interface CommentProps {
  event: CardEvent;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <div className="comment">
      <div className="text">{event.body?.text}</div>
    </div>
  );
};
