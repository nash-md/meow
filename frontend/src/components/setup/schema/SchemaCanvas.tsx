import { Button, Item, Picker } from '@adobe/react-spectrum';
import { Key, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { ANIMALS } from '../../../Constants';
import { Helper } from '../../../helpers/Helper';
import { Schema, SchemaAttribute } from '../../../interfaces/Schema';
import { SelectAttribute } from './SelectAttribute';
import { TextAreaAttribute } from './TextAreaAttribute';
import { TextAttribute } from './TextAttribute';

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

export interface SchemaCanvasProps {
  schema: Schema;
  validate: (schema: Schema) => void;
}

export const SchemaCanvas = ({
  schema: schemaImported,
  validate,
}: SchemaCanvasProps) => {
  const [items, setItems] = useState<Array<SchemaAttribute>>([]);
  const [type, setType] = useState<SchemaAttribute['type']>('text');
  const [schema, setSchema] = useState(schemaImported);

  useEffect(() => {
    const list: SchemaAttribute[] = [];

    schemaImported.schema.map((item) => {
      list[item.index] = item;
    });

    setItems([...list]);
  }, [schemaImported]);

  const add = () => {
    setItems([
      ...items,
      {
        key: Helper.generateUUID(),
        index: items.length,
        type: type,
        name: ANIMALS[items.length],
        options: [],
      },
    ]);
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
      validate({ ...schema, schema: [...list] });
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
      validate({ ...schema, schema: [...list] });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    console.log(
      `move from ${result.source.index} to ${result.destination?.index}`
    );

    const list = moveAttribute(
      items,
      result.source.index,
      result.destination!.index
    ).map((item, index) => {
      return { ...item, index };
    });

    setItems([...list]);

    if (schema) {
      validate({ ...schema, schema: [...list] });
    }
  };

  const onDragStart = () => {};

  const getAttribute = (item: any, index: Number) => {
    switch (item.type) {
      case 'text':
        return (
          <TextAttribute
            update={update}
            remove={remove}
            key={index}
            index={index}
            attributeKey={item.key}
            {...item}
          />
        );
      case 'textarea':
        return (
          <TextAreaAttribute
            update={update}
            remove={remove}
            key={index}
            index={index}
            attributeKey={item.key}
            {...item}
          />
        );
      case 'select':
        return (
          <SelectAttribute
            update={update}
            remove={remove}
            key={index}
            index={index}
            attributeKey={item.key}
            {...item}
          />
        );
    }
  };

  return (
    <div className="setup-card">
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="attributes">
          {(provided, snaphot) => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item, index) => {
                  return getAttribute(item, index);
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
          onSelectionChange={(key: Key) =>
            setType(key.toString() as SchemaAttribute['type'])
          }
        >
          <Item key="text">Text</Item>
          <Item key="textarea">TextArea</Item>
          <Item key="select">Dropdown</Item>
        </Picker>

        <Button onPress={add} variant="secondary">
          Add
        </Button>
      </div>
    </div>
  );
};
