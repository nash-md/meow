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
  latest: Attribute = {},
  previous: Attribute = {}
): AttributeChange[] => {
  const list: AttributeChange[] = [];

  for (const key in previous) {
    if (isEmptyOrNull(previous[key]!)) {
      delete previous[key];
    }
  }

  for (const key in latest) {
    if (isEmptyOrNull(latest[key]!)) {
      delete latest[key];
    }
  }

  getCommonKeys(previous, latest).forEach((key) => {
    if (latest[key] !== previous[key]) {
      const item: AttributeChange = { attribute: { key }, type: 'updated', value: latest[key] };

      list.push(item);
    }
  });

  for (const key in latest) {
    if (!previous.hasOwnProperty(key)) {
      list.push({ attribute: { key }, type: 'added', value: latest[key] });
    }
  }

  for (const key in previous) {
    if (!latest.hasOwnProperty(key)) {
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
