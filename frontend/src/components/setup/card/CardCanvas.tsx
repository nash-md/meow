import { Button, Item, Picker } from '@adobe/react-spectrum';
import { Key, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { showModalError, showModalSuccess } from '../../../actions/Actions';
import { ANIMALS, RESERVED_ATTRIBUTES } from '../../../Constants';
import { RequestHelperContext } from '../../../context/RequestHelperContextProvider';
import { SchemaAttribute } from '../../../interfaces/Schema';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectSchemaByType, store } from '../../../store/Store';
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
  key: string;
  index: number;
  name: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

function generateUUID(): string {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += Math.floor(Math.random() * 16).toString(16);
  }
  return uuid;
}

export const CardCanvas = () => {
  const existingSchema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, 'card')
  );

  const [items, setItems] = useState<Array<AttributeListItem>>([]);
  const [type, setType] = useState<AttributeListItem['type']>('text');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    if (existingSchema) {
      const list: SchemaAttribute[] = [];

      existingSchema.schema.map((item) => {
        list[item.index] = item;
      });

      setItems([...list]);
    }
  }, [existingSchema]);

  const add = () => {
    setItems([
      ...items,
      {
        key: generateUUID(),
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
  };

  const update = (key: string, updated: Partial<AttributeListItem>) => {
    const list = items.map((item, index) => {
      if (item.key === key) {
        return { ...item, ...updated, index };
      } else {
        return { ...item, index };
      }
    });

    setItems([...list]);

    validate(list);
  };

  const validate = (list: AttributeListItem[]) => {
    if (list.some((item) => !item.name)) {
      setError('An attribute name cannot be empty');
      setIsValid(false);

      return;
    }

    const filtered = list.filter((item) => item.type === 'select');

    if (
      filtered.some(
        (i) =>
          !i.options ||
          i.options.length === 0 ||
          i.options.some((option) => !option)
      )
    ) {
      setError('A dropdown list or a value cannot be empty');
      setIsValid(false);

      return;
    }

    if (
      list.some((item) =>
        RESERVED_ATTRIBUTES.includes(item.name.toLocaleLowerCase())
      )
    ) {
      setError('This name is reserved by the system and cannot be used');
      setIsValid(false);

      return;
    }

    setError('');
    setIsValid(true);
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
  };

  const onDragStart = () => {};

  const save = async () => {
    try {
      await client!.updateSchema('card', items);

      store.dispatch(showModalSuccess());
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

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
    <div className="content-box">
      <h2>Opportunity</h2>

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
        <div style={{ marginBottom: '5px' }}>{error}</div>
        <Button onPress={save} variant="primary" isDisabled={!isValid}>
          Save
        </Button>
      </div>
    </div>
  );
};
