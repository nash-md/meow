import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

export const Trash = (props: any) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: () => ({ name: 'trash' }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div ref={drop} className="trash">
      <h4>Trash</h4>
    </div>
  );
};
