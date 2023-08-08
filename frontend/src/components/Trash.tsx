import { Droppable } from 'react-beautiful-dnd';
import { TrashIcon } from './TrashIcon';

export const Trash = () => {
  return (
    <Droppable droppableId="trash">
      {(provided, snaphot) => {
        return (
          <div
            id="trash"
            style={{
              opacity: '0.3',
            }}
            className={`trash ${snaphot.isDraggingOver ? 'drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <TrashIcon />
          </div>
        );
      }}
    </Droppable>
  );
};
