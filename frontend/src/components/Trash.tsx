import { Droppable } from 'react-beautiful-dnd';

export const Trash = () => {
  return (
    <Droppable droppableId="trash">
      {(provided, snaphot) => {
        return (
          <div
            id="trash"
            className={`trash ${snaphot.isDraggingOver ? 'drag-over' : ''}`}
            style={{
              visibility: 'hidden',
              backgroundImage: snaphot.isDraggingOver
                ? 'url("/trash-icon-white.svg")'
                : 'url("/trash-icon-white.svg")',
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          ></div>
        );
      }}
    </Droppable>
  );
};
