import { Item, Picker, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SchemaReferenceAttribute, SchemaType } from '../../../interfaces/Schema';
import { IconReverseNameArrow } from '../IconReverseNameArrow';
import { IconDrag } from '../IconDrag';
import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

export interface ReferenceAttributeProps {
  attributeKey: string;
  name: string;
  reverseName: string;
  index: number;
  entity: SchemaType | null;
  remove: (index: number) => void;
  update: (key: string, item: Partial<SchemaReferenceAttribute>) => void;
}

export const ReferenceAttribute = ({
  attributeKey,
  name: nameDefault,
  reverseName: reverseNameDefault,
  entity: entityDefault,
  index,
  remove,
  update,
}: ReferenceAttributeProps) => {
  const [name, setName] = useState(nameDefault);
  const [reverseName, setReverseName] = useState(reverseNameDefault);
  const [entity, setEntity] = useState(entityDefault);
  const relationship = 'many-to-one';

  useEffect(() => {
    update(attributeKey, { name, entity, relationship, reverseName });
  }, [name, entity, reverseName]);

  return (
    <Draggable draggableId={`drag_${attributeKey}`} index={index}>
      {(provided, snaphot) => {
        return (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <div className={`item ${snaphot.isDragging ? 'is-dragging' : ''}`}>
              <div className="button">
                <div className="drag">
                  <IconDrag />
                </div>
              </div>

              <div className="name">
                <TextField value={name} onChange={setName} onBlur={() => setName(name.trim())} />
              </div>
              <div className="reference">
                <Picker
                  width="100%"
                  selectedKey={entity}
                  onSelectionChange={(key) => setEntity(key.toString() as SchemaType)}
                >
                  {Object.entries(SchemaType)
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
            <div className="item-reverse-relationship">
              <div>
                <div>{Translations.ReverseRelationshipNameLabel[DEFAULT_LANGUAGE]}</div>
                <TextField
                  value={reverseName}
                  onChange={setReverseName}
                  onBlur={() => setReverseName(reverseName.trim())}
                />
              </div>
              <div className="arrow">
                <IconReverseNameArrow />
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
