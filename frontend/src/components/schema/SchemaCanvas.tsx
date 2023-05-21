import { useEffect, useState } from 'react';
import {
  SchemaAttribute,
  Schema,
  SchemaSelectAttribute,
} from '../../interfaces/Schema';
import { SelectAttribute } from './SelectAttribute';
import { TextAreaAttribute } from './TextAreaAttribute';
import { TextAttribute } from './TextAttribute';
import { ReferenceAttribute } from './ReferenceAttribute';
import { BooleanAttribute } from './BooleanAttribute';
import { Attribute } from '../../interfaces/Attribute';

export interface SchemaCanvasProps {
  schema: Schema;
  values?: Attribute;
  validate: (values: Attribute) => void;
}

const toStringOrNull = (value: unknown) => {
  if (typeof value === 'undefined' || value === null) {
    return null;
  }

  return value ? value.toString() : null;
};

const toBooleanOrNull = (value: unknown): boolean | null => {
  if (typeof value === 'undefined' || value === null) {
    return null;
  }

  return Boolean(value);
};

export const SchemaCanvas = ({
  schema,
  values: valuesImport,
  validate,
}: SchemaCanvasProps) => {
  const [values, setValues] = useState<Attribute | undefined>(valuesImport);

  useEffect(() => {
    setValues(valuesImport);
  }, [valuesImport]);

  const updateAttribute = (key: string, value: Attribute[typeof key]) => {
    setValues({ ...values, [key]: value });

    validate({ ...values, [key]: value });
  };

  const getAttribute = (
    attribute: SchemaAttribute,
    value: string | number | boolean | null
  ) => {
    switch (attribute.type) {
      case 'text':
        return (
          <TextAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            {...attribute}
          />
        );
      case 'textarea':
        return (
          <TextAreaAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            {...attribute}
          />
        );
      case 'select':
        return (
          <SelectAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            {...(attribute as SchemaSelectAttribute)}
          />
        );
      case 'reference':
        return (
          <ReferenceAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            {...attribute}
          />
        );
      case 'boolean':
        return (
          <BooleanAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toBooleanOrNull(value)}
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
