import { TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AttributeListItem } from './SchemaCanvas';

export interface TextAreaAttributeProps {
  attributeKey: string;
  name: string;
  index: number;
  remove: (index: number) => void;
  update: (key: string, item: Partial<AttributeListItem>) => void;
}

export const TextAreaAttribute = ({
  attributeKey,
  name: nameDefault,
  index,
  remove,
  update,
}: TextAreaAttributeProps) => {
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
            <div className="item">
              <div className="button">
                <div className="drag"></div>
              </div>

              <div className="name">
                <TextField value={name} onChange={setName} />
              </div>
              <div className="placeholder-textarea"></div>
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
