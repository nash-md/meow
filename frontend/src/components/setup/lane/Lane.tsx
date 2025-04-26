import { Checkbox, Item, Picker, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { LaneListItem } from './LaneSchema';
import { LaneType, Tags } from '../../../interfaces/Lane';
import { IconDrag } from '../IconDrag';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

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
                  aria-label={Translations.NameLabel[DEFAULT_LANGUAGE]}
                  width="100%"
                  key="name"
                />
              </div>
              <div className="attribute">
                <Picker
                  aria-label={Translations.LaneTypeLabel[DEFAULT_LANGUAGE]}
                  selectedKey={laneData.type}
                  onSelectionChange={(value) => handleTypeChange(value as LaneType)}
                >
                  <Item key="normal">{Translations.NormalLaneType[DEFAULT_LANGUAGE]}</Item>
                  <Item key="closed-won">{Translations.ClosedWonLaneType[DEFAULT_LANGUAGE]}</Item>
                  <Item key="closed-lost">{Translations.ClosedLostLaneType[DEFAULT_LANGUAGE]}</Item>
                </Picker>
              </div>
              <div className="attribute" style={{ width: '185px' }}>
                {laneData.type === LaneType.Normal ? (
                  <Checkbox
                    aria-label={Translations.ExcludeFromForecastLabel[DEFAULT_LANGUAGE]}
                    isSelected={!laneData.inForecast}
                    onChange={() => handleInForecastChange(!laneData.inForecast)}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>{Translations.ExcludeFromForecastLabel[DEFAULT_LANGUAGE]}</span>
                  </Checkbox>
                ) : null}
              </div>
              <div className="attribute" style={{ width: '220px' }}>
                {laneData.type !== LaneType.Normal ? (
                  <>
                    <Picker
                      width={100}
                      aria-label={Translations.HideAfterDaysLabel[DEFAULT_LANGUAGE]}
                      onSelectionChange={(value) => updateTags(value.toString())}
                      defaultSelectedKey={
                        laneData.tags['hideAfterDays']
                          ? laneData.tags['hideAfterDays'].toString()
                          : ''
                      }
                    >
                      <Item key="">{Translations.NeverOption[DEFAULT_LANGUAGE]}</Item>
                      <Item key="30">30</Item>
                      <Item key="60">60</Item>
                      <Item key="90">90</Item>
                    </Picker>
                    <span style={{ whiteSpace: 'nowrap', paddingLeft: '10px' }}>
                      {Translations.HideAfterDaysLabel[DEFAULT_LANGUAGE]}
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
