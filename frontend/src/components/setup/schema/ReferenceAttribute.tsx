import { Item, Picker, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SchemaReferenceAttribute, SchemaType } from '../../../interfaces/Schema';

const options = Object.entries(SchemaType);

export interface ReferenceAttributeProps {
  attributeKey: string;
  name: string;
  index: number;
  reference: string | null;
  remove: (index: number) => void;
  update: (key: string, item: Partial<SchemaReferenceAttribute>) => void;
}

export const ReferenceAttribute = ({
  attributeKey,
  name: nameDefault,
  reference: referenceDefault,
  index,
  remove,
  update,
}: ReferenceAttributeProps) => {
  const [name, setName] = useState(nameDefault);
  const [reference, setReference] = useState(referenceDefault);

  useEffect(() => {
    update(attributeKey, { name, reference });
  }, [name, reference]);

  return (
    <Draggable draggableId={`drag_${attributeKey}`} index={index}>
      {(provided, snaphot) => {
        return (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <div className={`item ${snaphot.isDragging ? 'is-dragging' : ''}`}>
              <div className="button">
                <div className="drag"></div>
              </div>

              <div className="name">
                <TextField value={name} onChange={setName} onBlur={() => setName(name.trim())} />
              </div>
              <div className="reference">
                <Picker
                  width="100%"
                  selectedKey={reference}
                  onSelectionChange={(key) => setReference(key.toString())}
                >
                  {options
                    .filter((item) => item[1] === 'account')
                    .map(([value, key]) => {
                      return <Item key={key}>{value}</Item>;
                    })}
                </Picker>
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
