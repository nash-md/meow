import { AccountEvent } from '../../../interfaces/AccountEvent';

interface CommentProps {
  event: AccountEvent;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <div className="comment">
      <div className="text">{event.body?.text}</div>
    </div>
  );
};
