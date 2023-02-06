import { Event } from '../../../interfaces/Event';

interface CommentProps {
  event: Event;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <div style={{ backgroundColor: 'rgb(230, 230, 230)', padding: '10px' }}>
      {event.body?.text}
    </div>
  );
};
