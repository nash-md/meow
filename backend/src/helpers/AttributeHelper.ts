import { Attribute } from '../entities/Attribute.js';
import { Schema } from '../entities/Schema.js';

export interface AttributeChange {
  attribute: {
    key: string;
    name?: string;
  };
  type: 'added' | 'updated' | 'removed';
  value?: Attribute[keyof Attribute];
  reference?: {
    name: string;
  };
}

const isEmptyOrNull = (value: Attribute[keyof Attribute]) => {
  return value === '' || value == null ? true : false;
};

function getCommonKeys(a: object, b: object): string[] {
  return Object.keys(a).filter((key) => b.hasOwnProperty(key));
}

export const getAttributeListDifference = (
  existing: Attribute = {},
  updated: Attribute = {}
): AttributeChange[] => {
  const list: AttributeChange[] = [];

  for (const key in existing) {
    if (isEmptyOrNull(existing[key]!)) {
      delete existing[key];
    }
  }

  for (const key in updated) {
    if (isEmptyOrNull(updated[key]!)) {
      delete updated[key];
    }
  }

  getCommonKeys(existing, updated).forEach((key) => {
    if (updated[key] !== existing[key]) {
      const item: AttributeChange = { attribute: { key }, type: 'updated', value: updated[key] };

      list.push(item);
    }
  });

  for (const key in updated) {
    if (!existing.hasOwnProperty(key)) {
      list.push({ attribute: { key }, type: 'added', value: updated[key] });
    }
  }

  for (const key in existing) {
    if (!updated.hasOwnProperty(key)) {
      list.push({ attribute: { key }, type: 'removed', value: null });
    }
  }

  return list;
};

export const findAttributeById = (key: string, schema: Schema | null) => {
  if (!schema) {
    return;
  }

  return schema.attributes.find((attribute) => attribute.key === key);
};
