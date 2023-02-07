import { Droppable } from 'react-beautiful-dnd';

export const Trash = () => {
  return (
    <Droppable droppableId="trash">
      {(provided, snaphot) => {
        return (
          <div
            id="trash"
            className="trash"
            style={{
              backgroundColor: snaphot.isDraggingOver ? 'red' : 'white',
              visibility: 'hidden',
              backgroundImage: snaphot.isDraggingOver
                ? 'url("/trash-icon-white.svg")'
                : 'url("/trash-icon.svg")',
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          ></div>
        );
      }}
    </Droppable>
  );
};
