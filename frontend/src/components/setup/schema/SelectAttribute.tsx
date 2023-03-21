import { TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ANIMALS } from '../../../Constants';
import { SchemaAttribute } from '../../../interfaces/Schema';

function removeOption<T>(items: T[], index: number): T[] {
  items.splice(index, 1);

  return items;
}

export interface SelectAttributeProps {
  attributeKey: string;
  name: string;
  index: number;
  options: string[];
  remove: (index: number) => void;
  update: (key: string, item: Partial<SchemaAttribute>) => void;
}

export const SelectAttribute = ({
  attributeKey,
  name: nameDefault,
  index,
  remove,
  update,
  options: optionsDefault,
}: SelectAttributeProps) => {
  const [name, setName] = useState(nameDefault);
  const [options, setOptions] = useState(optionsDefault);

  useEffect(() => {
    update(attributeKey, { name, options });
  }, [name, options]);

  const setOption = (name: string, index: number) => {
    options[index] = name;

    setOptions([...options]);
  };

  const addOption = () => {
    setOptions([...options, ANIMALS[options.length]]);
  };

  const removeOptiom = (index: number) => {
    const list = removeOption(options, index);

    setOptions([...list]);
  };

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
              <div className="select">
                {options.map((option, index) => {
                  return (
                    <div key={index} className="option">
                      <div className="name">
                        <TextField
                          width="100%"
                          value={option}
                          onChange={(value) => setOption(value, index)}
                        />
                      </div>
                      <div
                        className="remove"
                        onClick={() => removeOptiom(index)}
                      >
                        <img src="/remove-icon.svg" />
                      </div>
                    </div>
                  );
                })}

                <div className="add" onClick={addOption}>
                  <img src="/add-icon.svg" />
                </div>
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
