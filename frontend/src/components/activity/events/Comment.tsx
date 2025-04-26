import { CommentEvent } from '../../../interfaces/CardEvent';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

interface CommentProps {
  event: CommentEvent;
}

export const Comment = ({ event }: CommentProps) => {
  return (
    <>
      {Translations.NoteAdded[DEFAULT_LANGUAGE]} <i>{event.body?.text}</i>
    </>
  );
};
