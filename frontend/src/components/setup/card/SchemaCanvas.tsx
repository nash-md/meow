import { Button, Item, Picker } from '@adobe/react-spectrum';
import { Key, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { ANIMALS } from '../../../Constants';
import { RequestHelperContext } from '../../../context/RequestHelperContextProvider';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectSchemaByType } from '../../../store/Store';
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

export interface AttributeListItem {
  id: number;
  name: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

export const SchemaCanvas = () => {
  const existingSchema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, 'card')
  );

  useEffect(() => {
    if (existingSchema) {
      setItems([...existingSchema.schema]);
    }
  }, [existingSchema]);

  const [items, setItems] = useState<Array<AttributeListItem>>([]);

  const [type, setType] = useState<AttributeListItem['type']>('text');

  const { client } = useContext(RequestHelperContext);

  const add = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        type: type,
        name: ANIMALS[items.length],
        options: [],
      },
    ]);
  };

  const remove = (index: number) => {
    const list = removeAttribute(items, index);

    setItems([...list]);
  };

  const update = (index: number, item: Partial<AttributeListItem>) => {
    console.log('update');
    if (item.name) {
      items[index].name = item.name;
    }

    items[index].options = item.options;
  };

  const onDragEnd = async (result: DropResult) => {
    console.log(
      `move from ${result.source.index} to ${result.destination?.index}`
    );

    const list = moveAttribute(
      items,
      result.source.index,
      result.destination!.index
    );

    setItems([...list]);
  };

  const onDragStart = () => {};

  const save = async () => {
    await client?.updateSchema('card', items);
  };

  const getItem = (item: any, index: Number) => {
    switch (item.type) {
      case 'text':
        return (
          <TextAttribute
            update={update}
            remove={remove}
            key={item.id}
            index={index}
            {...item}
          />
        );
      case 'textarea':
        return (
          <TextAreaAttribute
            update={update}
            remove={remove}
            key={item.id}
            index={index}
            {...item}
          />
        );
      case 'select':
        return (
          <SelectAttribute
            update={update}
            remove={remove}
            key={item.id}
            index={index}
            {...item}
          />
        );
    }
  };

  return (
    <div className="content-box">
      <h2>Opportunity</h2>

      <div className="setup-card">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="attributes">
            {(provided, snaphot) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, index) => {
                    return getItem(item, index);
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
              setType(key.toString() as AttributeListItem['type'])
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

      <div style={{ marginTop: '10px' }}>
        <Button onPress={save} variant="primary">
          Save
        </Button>
      </div>
    </div>
  );
};
