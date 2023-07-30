import { Attribute } from '../entities/Attribute.js';
import { Schema } from '../entities/Schema.js';

export interface AttributeChange {
  key: Attribute['key'];
  type: 'added' | 'updated' | 'removed';
  name?: string;
  value?: string | number | null | undefined | boolean;
}

export const getAttributeListDifference = (
  existing: Attribute = {},
  updated: Attribute = {}
): AttributeChange[] => {
  const list: AttributeChange[] = [];

  for (const key in existing) {
    let type = 'updated' as (typeof list)[number]['type'];

    if (existing[key] !== '' && updated[key] === '') {
      type = 'removed';
    }

    if (existing[key] === '' && updated[key] !== '') {
      type = 'added';
    }

    if (updated[key] !== existing[key]) {
      const item: AttributeChange = { key: key, type: type };

      if (updated[key] !== undefined && updated[key] !== '') {
        item.value = updated[key];
      }

      list.push(item);
    }
  }

  for (const key in updated) {
    if (!existing.hasOwnProperty(key)) {
      list.push({ key: key, type: 'added', value: updated[key] });
    }
  }

  for (const key in existing) {
    if (!updated.hasOwnProperty(key)) {
      list.push({ key: key, type: 'removed', value: null });
    }
  }

  return list;
};

export const filterAttributeList = (schema: Schema | null, list: AttributeChange[]) => {
  if (!schema || list.length === 0) {
    return [];
  }

  const filtered = list
    .filter((item) => schema?.attributes.find((a) => a.key === item.key))
    .map((item) => {
      const attribute = schema?.attributes.find((a) => a.key === item.key);
      if (attribute) {
        return { ...item, name: attribute.name };
      }
    });

  return filtered;
};
