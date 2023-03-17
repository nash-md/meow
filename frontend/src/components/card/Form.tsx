import { Button, TextField, DatePicker } from '@adobe/react-spectrum';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { parseDate } from '@internationalized/date';
import {
  selectCard,
  selectSchemaByType,
  selectUserId,
} from '../../store/Store';
import { ApplicationStore } from '../../store/ApplicationStore';
import {
  Card,
  CardAttribute,
  CardFormPreview,
  CardPreview,
} from '../../interfaces/Card';
import { SchemaAttribute } from '../../interfaces/Schema';
import { SelectAttribute } from './schema/SelectAttribute';
import { TextAreaAttribute } from './schema/TextAreaAttribute';
import { TextAttribute } from './schema/TextAttribute';
import { Translations } from '../../Translations';

export interface FormProps {
  id: string | undefined;
  update: (id: Card['id'] | undefined, card: CardPreview) => void;
}

// TODO rename component
export const Form = ({ update, id }: FormProps) => {
  const userId = useSelector(selectUserId);
  const [attributes, setAttributes] = useState<CardAttribute>({});
  const [preview, setPreview] = useState<CardFormPreview>({
    name: '',
    amount: '',
    laneId: '',
    attributes: undefined,
    userId: userId!,
  });

  useEffect(() => {
    setAttributes(preview.attributes || {});
  }, [preview.attributes]);

  const handlePreviewUpdate = (key: string, value: string | number) => {
    setPreview({
      ...preview,
      [key]: value,
    });
  };

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, 'card')
  );

  let isValidAmount = useMemo(
    () => /^[\d]{1,10}$/.test(preview.amount) && parseInt(preview.amount) > 0,
    [preview]
  );

  let isValidNextFollowUp = useMemo(() => preview.nextFollowUpAt, [preview]);

  let isValidForm = useMemo(() => {
    if (preview.name && isValidAmount && isValidNextFollowUp) {
      return true;
    }

    return false;
  }, [preview]);

  const card = useSelector((store: ApplicationStore) => selectCard(store, id));

  useEffect(() => {
    const list: CardAttribute = {};

    if (card) {
      schema?.schema.map((attribute) => {
        list[attribute.key] = card.attributes?.[attribute.key] ?? '';
      });

      setPreview({
        ...card,
        attributes: { ...list },
        amount: card.amount ? card.amount.toString() : '',
      });
    } else {
      schema?.schema.map((attribute) => {
        list[attribute.key] = '';
      });

      setPreview({
        name: '',
        amount: '',
        laneId: '',
        attributes: { ...list },
        userId: userId!,
      });
    }
  }, [card, schema]);

  const save = () => {
    update(id, { ...preview, amount: parseInt(preview.amount) });
  };

  const updateAttribute = (key: string, value: string) => {
    setPreview({
      ...preview,
      attributes: {
        ...preview.attributes,
        [key]: value,
      },
    });
  };

  const getAttribute = (
    attribute: SchemaAttribute,
    value: string | undefined | null
  ) => {
    switch (attribute.type) {
      case 'text':
        return (
          <TextAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={value ?? ''}
            {...attribute}
          />
        );
      case 'textarea':
        return (
          <TextAreaAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={value ?? ''}
            {...attribute}
          />
        );
      case 'select':
        return (
          <SelectAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={value ?? ''}
            {...attribute}
          />
        );
    }
  };

  return (
    <>
      <div className="card">
        <TextField
          onChange={(value) => handlePreviewUpdate('name', value)}
          value={preview.name}
          aria-label="Name"
          width="100%"
          key="name"
          label="Name"
          validationState={preview.name ? 'valid' : 'invalid'}
        />

        {schema?.schema.map((attribute) => {
          return getAttribute(
            attribute!,
            attributes?.[attribute.key]?.toString()
          );
        })}

        <div className="attribute">
          <TextField
            onChange={(value) => handlePreviewUpdate('amount', value)}
            value={preview.amount}
            aria-label={Translations.OpportunityAmount.en}
            width="100%"
            key="amount"
            inputMode="decimal"
            label={Translations.OpportunityAmount.en}
            validationState={isValidAmount ? 'valid' : 'invalid'}
            errorMessage={Translations.OpportunityAmountInvalid.en}
          />
        </div>
      </div>

      <div className="card-dates">
        <div>
          <DatePicker
            value={
              preview.nextFollowUpAt
                ? parseDate(preview.nextFollowUpAt.substring(0, 10))
                : undefined
            }
            onChange={(value) =>
              handlePreviewUpdate('nextFollowUpAt', value.toString())
            }
            label="Next Follow Up"
            validationState={isValidNextFollowUp ? 'valid' : 'invalid'}
          />
        </div>

        <div>
          <DatePicker
            value={
              preview.closedAt
                ? parseDate(preview.closedAt.substring(0, 10))
                : undefined
            }
            onChange={(value) =>
              handlePreviewUpdate('closedAt', value.toString())
            }
            label="Expected Close Date"
          />
        </div>
      </div>

      <div className="card-submit">
        <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
          Save
        </Button>
      </div>
    </>
  );
};
