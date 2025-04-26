import { Button, Item, Picker } from '@adobe/react-spectrum';
import { Key, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { ANIMALS, DEFAULT_LANGUAGE } from '../../../Constants';
import { generateUUID } from '../../../helpers/Helper';
import { Translations } from '../../../Translations';
import {
  Schema,
  SchemaAttribute,
  SchemaAttributeType,
  SchemaReferenceAttribute,
  SchemaSelectAttribute,
  SchemaType,
} from '../../../interfaces/Schema';
import { SelectAttribute } from './SelectAttribute';
import { TextAreaAttribute } from './TextAreaAttribute';
import { TextAttribute } from './TextAttribute';
import { ReferenceAttribute } from './ReferenceAttribute';
import { BooleanAttribute } from './BooleanAttribute';
import { EmailAttribute } from './EmailAttribute';

function moveAttribute<T>(items: T[], from: number, to: number): T[] {
  const lane = items[from];

  const updated = [...items];

  updated.splice(from, 1);
  updated.splice(to, 0, lane);

  return updated;
}

function removeAttribute<T>(items: T[], index: number): T[] {
  items.splice(index, 1);

  return items;
}

const getOptions = (schema: Schema) => {
  const list = [
    <Item key="text">{Translations.TextAttributeLabel[DEFAULT_LANGUAGE]}</Item>,
    <Item key="email">{Translations.EmailAttributeLabel[DEFAULT_LANGUAGE]}</Item>,
    <Item key="textarea">{Translations.TextAreaAttributeLabel[DEFAULT_LANGUAGE]}</Item>,
    <Item key="select">{Translations.DropdownAttributeLabel[DEFAULT_LANGUAGE]}</Item>,
    <Item key="boolean">{Translations.CheckboxAttributeLabel[DEFAULT_LANGUAGE]}</Item>,
  ];

  if (schema.type === SchemaType.Card) {
    list.push(<Item key="reference">{Translations.ReferenceAttributeLabel[DEFAULT_LANGUAGE]}</Item>);
  }

  return list;
};

export interface SchemaCanvasProps {
  schema: Schema;
  validate: (schema: Schema) => void;
}

export const SchemaCanvas = ({ schema: schemaImported, validate }: SchemaCanvasProps) => {
  const [items, setItems] = useState<Array<SchemaAttribute>>([]);
  const [type, setType] = useState<SchemaAttributeType>(SchemaAttributeType.Text);
  const [schema, setSchema] = useState(schemaImported);

  useEffect(() => {
    const list: SchemaAttribute[] = [];

    schemaImported.attributes.map((item) => {
      list[item.index] = item;
    });

    setItems([...list]);
  }, [schemaImported]);

  const add = () => {
    const item = {
      key: generateUUID(),
      index: items.length,
      type: type,
      name: ANIMALS[items.length],
    };

    if (type === SchemaAttributeType.Select) {
      (item as SchemaSelectAttribute).options = [ANIMALS[0], ANIMALS[1]];
    }

    setItems([...items, item]);
  };

  const remove = (index: number) => {
    const list = removeAttribute(items, index).map((item, index) => {
      return {
        ...item,
        index: index,
      };
    });

    setItems([...list]);

    if (schema) {
      validate({ ...schema, attributes: [...list] });
    }
  };

  const update = (key: string, updated: Partial<SchemaAttribute>) => {
    const list = items.map((item, index) => {
      if (item.key === key) {
        return { ...item, ...updated, index };
      } else {
        return { ...item, index };
      }
    });

    setItems([...list]);

    if (schema) {
      validate({ ...schema, attributes: [...list] });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    console.log(`move from ${result.source.index} to ${result.destination?.index}`);

    const list = moveAttribute(items, result.source.index, result.destination!.index).map(
      (item, index) => {
        return { ...item, index };
      }
    );

    setItems([...list]);

    if (schema) {
      validate({ ...schema, attributes: [...list] });
    }
  };

  const onDragStart = () => {};

  const getAttribute = (item: SchemaAttribute) => {
    switch (item.type) {
      case SchemaAttributeType.Text:
        return <TextAttribute update={update} remove={remove} attributeKey={item.key} {...item} />;
      case SchemaAttributeType.Email:
        return <EmailAttribute update={update} remove={remove} attributeKey={item.key} {...item} />;
      case SchemaAttributeType.TextArea:
        return (
          <TextAreaAttribute update={update} remove={remove} attributeKey={item.key} {...item} />
        );
      case SchemaAttributeType.Select:
        return (
          <SelectAttribute
            update={update}
            remove={remove}
            attributeKey={item.key}
            {...(item as SchemaSelectAttribute)}
          />
        );
      case SchemaAttributeType.Reference:
        return (
          <ReferenceAttribute
            update={update}
            remove={remove}
            attributeKey={item.key}
            {...(item as SchemaReferenceAttribute)}
          />
        );
      case SchemaAttributeType.Boolean:
        return (
          <BooleanAttribute update={update} remove={remove} attributeKey={item.key} {...item} />
        );
      default:
        return <div>{Translations.UnknownAttributeTypeError[DEFAULT_LANGUAGE]}</div>; // TODO should throw
    }
  };

  return (
    <div className="setup-card">
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="attributes">
          {(provided, snaphot) => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item) => {
                  return getAttribute(item);
                })}

                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
      <div className="add-attribute">
        <Picker
          defaultSelectedKey="text"
          onSelectionChange={(key: Key) => setType(key.toString() as SchemaAttributeType)}
        >
          {getOptions(schema)}
        </Picker>

        <Button onPress={add} variant="secondary">
          {Translations.AddAttributeButton[DEFAULT_LANGUAGE]}
        </Button>
      </div>
    </div>
  );
};
