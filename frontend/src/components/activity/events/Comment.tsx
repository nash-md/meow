import { CommentEvent } from '../../../interfaces/CardEvent';

interface CommentProps {
  event: CommentEvent;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <>
      Added note: <i>{event.body?.text}</i>
    </>
  );
};
