import { CommentEvent } from '../../../interfaces/CardEvent';

interface CommentProps {
  event: CommentEvent;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <>
      Note ajoutée: <i>{event.body?.text}</i>
    </>
  );
};
