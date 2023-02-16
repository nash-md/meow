import { Event } from '../../../interfaces/Event';

interface AttributeProps {
  event: Event;
}

export const Attribute = ({ event }: AttributeProps) => {
  return <div>The opportunity was updated</div>;
};
