import { Checkbox, Item, Picker, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { LaneListItem } from './LaneCanvas';
import { LaneType } from '../../../interfaces/Lane';

export interface LaneProps {
  id: number;
  key: number;
  name: string;
  index: number;
  type?: LaneType;
  inForecast: boolean;
  remove: (index: number) => void;
  update: (index: number, item: Pick<LaneListItem, 'inForecast' | 'name' | 'type'>) => void;
}

export const Lane = (props: LaneProps) => {
  const [id, setId] = useState<number>(props.id);
  const [name, setName] = useState<string>(props.name);
  const [inForecast, setInForecast] = useState<boolean>(props.inForecast);
  const [type, setType] = useState<LaneType | undefined>(props.type);

  useEffect(() => {
    props.update(props.id, { name, inForecast, type });
  }, [name, inForecast, type]);

  useEffect(() => {
    setId(props.id);
    setName(props.name);
    setInForecast(props.inForecast);
    setType(props.type);
  }, [props]);

  return (
    <Draggable draggableId={`drag_${id}`} index={props.index}>
      {(provided, snaphot) => {
        return (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <div className={`lane ${snaphot.isDragging ? 'is-dragging' : ''}`}>
              <div className="button">
                <div className="drag"></div>
              </div>
              <div className="attribute">
                <TextField
                  onChange={setName}
                  onBlur={() => setName(name.trim())}
                  value={name}
                  aria-label="Name"
                  width="100%"
                  key="name"
                />
              </div>
              <div className="attribute">
                <Picker
                  selectedKey={type}
                  onSelectionChange={(value) => setType(value.toString() as LaneType)}
                >
                  <Item key="normal">Normal</Item>
                  <Item key="closed-won">Closed Won</Item>
                  <Item key="closed-lost">Closed Lost</Item>
                </Picker>
              </div>

              <div className="attribute">
                <Checkbox isSelected={!inForecast} onChange={(value) => setInForecast(!value)}>
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
