import { Button, TextField, DatePicker } from '@adobe/react-spectrum';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { parseDate } from '@internationalized/date';
import { selectCard, selectLanes, selectSchemaByType } from '../../store/Store';
import { ApplicationStore } from '../../store/ApplicationStore';
import { Card } from '../../interfaces/Card';
import { SchemaAttribute } from '../../interfaces/Schema';
import { SelectAttribute } from './schema/SelectAttribute';
import { TextAreaAttribute } from './schema/TextAreaAttribute';
import { TextAttribute } from './schema/TextAttribute';

export interface FormProps {
  id: string | undefined;
  add: any;
}

// TODO rename component
export const Form = ({ add, id }: FormProps) => {
  const lanes = useSelector(selectLanes);
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [attributes, setAttributes] = useState(new Map<string, string>());

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, 'card')
  );

  let isValidAmount = useMemo(
    () => /^[\d]{1,10}$/.test(amount as string),
    [amount]
  );

  let isValidForm = useMemo(() => {
    if (name && isValidAmount) {
      return true;
    }

    return false;
  }, [amount, name]);

  const [closedAt, setClosedAt] = useState<any>(null);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));

  useEffect(() => {
    if (!card) {
      const userAttributes = new Map<string, string>();

      schema?.schema.map((attribute) => {
        userAttributes.set(attribute.key, '');
      });

      setAttributes(userAttributes);

      return;
    }

    setName(card.name);
    setAmount(card.amount?.toString());

    const userAttributes = new Map<string, string>();

    schema?.schema.map((attribute) => {
      userAttributes.set(attribute.key, '');
    });

    if (card.attributes) {
      card.attributes.map((attribute) => {
        userAttributes.set(attribute.keyId, attribute.value);
      });
    }

    setAttributes(userAttributes);

    if (card.closedAt) {
      const date = parseDate(card.closedAt.toString().substring(0, 10));

      setClosedAt(date);
    }
  }, [card]);

  const save = () => {
    const userAttributes = Array.from(attributes.entries()).map(
      ([key, value]) => {
        return { keyId: key, value };
      }
    );

    const updated: Card = {
      ...card!,
      name,
      amount: parseInt(amount),
      attributes: userAttributes,
      closedAt: closedAt ? closedAt.toString() : undefined,
    };

    if (!updated.lane) {
      updated.lane = lanes[0].id;
    }
    add(updated);
  };

  const update = (key: string, value: string) => {
    const updated = new Map(attributes);

    updated.set(key, value);

    setAttributes(updated);
  };

  const getAttribute = (attribute: SchemaAttribute, value: string) => {
    switch (attribute.type) {
      case 'text':
        return (
          <TextAttribute
            update={update}
            attributeKey={attribute.key}
            value={value}
            {...attribute}
          />
        );
      case 'textarea':
        return (
          <TextAreaAttribute
            update={update}
            attributeKey={attribute.key}
            value={value}
            {...attribute}
          />
        );
      case 'select':
        return (
          <SelectAttribute
            update={update}
            attributeKey={attribute.key}
            value={value}
            {...attribute}
          />
        );
    }
  };

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <TextField
          onChange={setName}
          value={name}
          aria-label="Name"
          width="100%"
          key="name"
          label="Name"
        />
      </div>

      {Array.from(attributes.entries()).map(([key, value]) => {
        const attribute = schema?.schema.find((a) => a.key === key);

        // can happen if the database contains attributes that are not on the schema anymore
        if (!attribute) {
          return;
        }

        return getAttribute(attribute!, value);
      })}

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <div>
          <TextField
            onChange={setAmount}
            value={amount}
            aria-label="Amount"
            width="100%"
            key="name"
            inputMode="decimal"
            label="Amount"
            validationState={isValidAmount ? 'valid' : 'invalid'}
            errorMessage="Invalid Amount"
          />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <DatePicker
            value={closedAt}
            onChange={setClosedAt}
            label="Expected Close Date"
          />
        </div>
        <div style={{ marginTop: '24px', marginLeft: '10px' }}>
          <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
