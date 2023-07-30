import { useEffect, useState } from 'react';
import { SchemaAttribute, Schema, SchemaSelectAttribute } from '../../interfaces/Schema';
import { SelectAttribute } from './SelectAttribute';
import { TextAreaAttribute } from './TextAreaAttribute';
import { TextAttribute } from './TextAttribute';
import { ReferenceAttribute } from './ReferenceAttribute';
import { BooleanAttribute } from './BooleanAttribute';
import { Attribute } from '../../interfaces/Attribute';
import { EmailAttribute } from './EmailAttribute';

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

export interface SchemaCanvasProps {
  schema: Schema;
  values?: Attribute;
  isDisabled: boolean;
  validate: (values: Attribute) => void;
}

export const SchemaCanvas = ({
  schema,
  values: valuesImport,
  validate,
  isDisabled,
}: SchemaCanvasProps) => {
  const [values, setValues] = useState<Attribute | undefined>(valuesImport);

  useEffect(() => {
    setValues(valuesImport);
  }, [valuesImport]);

  const updateAttribute = (key: string, value: Attribute[typeof key] | null) => {
    const updated = { ...values };

    if (value === null) {
      delete updated[key];
    } else {
      updated[key] = value;
    }

    setValues({ ...updated });
    validate({ ...updated });
  };

  const getAttribute = (attribute: SchemaAttribute, value: string | number | boolean | null) => {
    switch (attribute.type) {
      case 'text':
        return (
          <TextAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            isDisabled={isDisabled}
            {...attribute}
          />
        );
      case 'email':
        return (
          <EmailAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            isDisabled={isDisabled}
            {...attribute}
          />
        );
      case 'textarea':
        return (
          <TextAreaAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            isDisabled={isDisabled}
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
            isDisabled={isDisabled}
          />
        );
      case 'reference':
        return (
          <ReferenceAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toStringOrNull(value)}
            {...attribute}
            isDisabled={isDisabled}
          />
        );
      case 'boolean':
        return (
          <BooleanAttribute
            update={updateAttribute}
            attributeKey={attribute.key}
            value={toBooleanOrNull(value)}
            {...attribute}
            isDisabled={isDisabled}
          />
        );
    }
  };

  return (
    <>
      {schema?.attributes?.map((attribute) => {
        return getAttribute(attribute!, values?.[attribute.key] ?? null);
      })}
    </>
  );
};
