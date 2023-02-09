import { Checkbox, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export const Lane = (props: any) => {
  const [name, setName] = useState<string>(props.name);
  const [inForecast, setInForecast] = useState<boolean>(props.inForecast);

  useEffect(() => {
    props.update(props.index, { name, inForecast });
  }, [name, inForecast]);

  return (
    <Draggable draggableId={`drag_${props.id}`} index={props.index}>
      {(provided, snaphot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div
              className="lane"
              style={{
                backgroundColor: snaphot.isDragging ? '#F6F6F6' : 'white',
              }}
            >
              <div className="button">
                <div className="drag"></div>
              </div>
              <div className="attribute">
                <TextField
                  onChange={setName}
                  value={name}
                  aria-label="Name"
                  width="100%"
                  key="name"
                />
              </div>
              <div className="attribute">
                <Checkbox
                  isSelected={!inForecast}
                  onChange={(value) => setInForecast(!value)}
                >
                  Exclude from Forecast
                </Checkbox>
              </div>

              <div onClick={() => props.remove(props.index)} className="button">
                <div className="remove"></div>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
