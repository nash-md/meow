import { Checkbox, Item, Picker, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { LaneListItem } from './LaneSchema';
import { LaneType, Tags } from '../../../interfaces/Lane';
import { IconDrag } from '../IconDrag';

export interface LaneProps {
  id: string;
  key: string;
  name: string;
  index: number;
  type?: LaneType;
  tags?: Tags;
  inForecast: boolean;
  remove: (index: number) => void;
  update: (
    index: number,
    item: Pick<LaneListItem, 'inForecast' | 'name' | 'type' | 'tags'>
  ) => void;
}

export const Lane = (props: LaneProps) => {
  const [laneData, setLaneData] = useState({
    id: props.id,
    name: props.name,
    inForecast: props.inForecast,
    type: props.type,
    tags: props.tags || {},
  });

  const handleNameChange = (value: string) => {
    setLaneData((prevData) => ({
      ...prevData,
      name: value.trim(),
    }));
  };

  const handleNameBlur = () => {
    setLaneData((prevData) => ({
      ...prevData,
      name: prevData.name.trim(), // Trim the name on blur
    }));
  };

  const handleInForecastChange = (value: boolean) => {
    setLaneData((prevData) => ({
      ...prevData,
      inForecast: value,
    }));
  };

  const handleTypeChange = (value: LaneType) => {
    setLaneData((prevData) => {
      const newTags = { ...prevData.tags };

      if (value === LaneType.Normal) {
        delete newTags['hideAfterDays'];
      }

      return {
        ...prevData,
        type: value,
        tags: newTags,
        inForecast: false,
      };
    });
  };

  const updateTags = (value: string) => {
    setLaneData((prevData) => {
      const newTags = { ...prevData.tags };

      if (prevData.type !== LaneType.Normal && value !== '') {
        newTags['hideAfterDays'] = value;
      } else {
        delete newTags['hideAfterDays'];
      }

      return { ...prevData, tags: newTags };
    });
  };

  useEffect(() => {
    props.update(props.index, {
      name: laneData.name,
      inForecast: laneData.inForecast,
      type: laneData.type,
      tags: laneData.tags,
    });
  }, [laneData]);

  useEffect(() => {
    console.log('PROPS UPDATE');
    setLaneData({
      id: props.id,
      name: props.name,
      inForecast: props.inForecast,
      type: props.type,
      tags: props.tags || {},
    });
  }, [props]);
  return (
    <Draggable draggableId={`drag_${props.id}`} index={props.index}>
      {(provided, snaphot) => {
        return (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <div className={`lane ${snaphot.isDragging ? 'is-dragging' : ''}`}>
              <div className="button">
                <div className="drag">
                  <IconDrag />
                </div>
              </div>

              <div className="attribute">
                <TextField
                  onBlur={() => handleNameBlur()}
                  onChange={(value) => handleNameChange(value)}
                  value={laneData.name}
                  aria-label="Name"
                  width="100%"
                  key="name"
                />
              </div>
              <div className="attribute">
                <Picker
                  aria-label="Lane Type"
                  selectedKey={laneData.type}
                  onSelectionChange={(value) => handleTypeChange(value as LaneType)}
                >
                  <Item key="normal">Normal</Item>
                  <Item key="closed-won">Closed Won</Item>
                  <Item key="closed-lost">Closed Lost</Item>
                </Picker>
              </div>
              <div className="attribute" style={{ width: '185px' }}>
                {laneData.type === LaneType.Normal ? (
                  <Checkbox
                    aria-label="Exclude from Forecast"
                    isSelected={!laneData.inForecast}
                    onChange={() => handleInForecastChange(!laneData.inForecast)}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>Exclude from Forecast</span>
                  </Checkbox>
                ) : null}
              </div>
              <div className="attribute" style={{ width: '220px' }}>
                {laneData.type !== LaneType.Normal ? (
                  <>
                    <Picker
                      width={100}
                      aria-label="Hide After Days"
                      onSelectionChange={(value) => updateTags(value.toString())}
                      defaultSelectedKey={
                        laneData.tags['hideAfterDays']
                          ? laneData.tags['hideAfterDays'].toString()
                          : ''
                      }
                    >
                      <Item key="">never</Item>
                      <Item key="30">30</Item>
                      <Item key="60">60</Item>
                      <Item key="90">90</Item>
                    </Picker>
                    <span style={{ whiteSpace: 'nowrap', paddingLeft: '10px' }}>
                      Hide After Days
                    </span>
                  </>
                ) : null}
              </div>
              <div onClick={() => props.remove(props.index)} className="attribute button">
                <div className="remove"></div>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
