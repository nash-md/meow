import { useEffect, useState } from 'react';
import { CardAttribute } from '../../interfaces/Card';
import { SchemaAttribute, Schema } from '../../interfaces/Schema';
import { SelectAttribute } from './SelectAttribute';
import { TextAreaAttribute } from './TextAreaAttribute';
import { TextAttribute } from './TextAttribute';

export interface SchemaCanvasProps {
  schema: Schema;
  values?: CardAttribute;
  validate: (values: CardAttribute) => void;
}

export const SchemaCanvas = ({
  schema,
  values: valuesImport,
  validate,
}: SchemaCanvasProps) => {
  const [values, setValues] = useState<CardAttribute | undefined>(valuesImport);

  useEffect(() => {
    setValues(valuesImport);
  }, [valuesImport]);

  const updateAttribute = (key: string, value: string) => {
    setValues({ ...values, [key]: value });

    validate({ ...values, [key]: value });
  };

  const getAttribute = (
    attribute: SchemaAttribute,
    value: string | number | null
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
      {schema?.schema.map((attribute) => {
        return getAttribute(attribute!, values?.[attribute.key] ?? null);
      })}
    </>
  );
};
