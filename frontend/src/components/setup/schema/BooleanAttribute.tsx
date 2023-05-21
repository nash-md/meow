import { TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SchemaAttribute } from '../../../interfaces/Schema';

export interface BooleanAttributeProps {
  attributeKey: string;
  name: string;
  index: number;
  remove: (index: number) => void;
  update: (key: string, item: Partial<SchemaAttribute>) => void;
}

export const BooleanAttribute = ({
  attributeKey,
  name: nameDefault,
  index,
  remove,
  update,
}: BooleanAttributeProps) => {
  const [name, setName] = useState(nameDefault);

  useEffect(() => {
    update(attributeKey, { name });
  }, [name]);

  return (
    <Draggable draggableId={`drag_${attributeKey}`} index={index}>
      {(provided, snaphot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className={`item ${snaphot.isDragging ? 'is-dragging' : ''}`}>
              <div className="button">
                <div className="drag"></div>
              </div>

              <div className="name">
                <TextField value={name} onChange={setName} />
              </div>
              <div className="placeholder-boolean">
                <div>&nbsp;</div>
                <div>{name}</div>
              </div>
              <div onClick={() => remove(index)} className="button">
                <div className="remove"></div>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
