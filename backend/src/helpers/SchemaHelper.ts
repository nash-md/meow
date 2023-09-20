import { ObjectId } from 'mongodb';
import { Attribute } from '../entities/Attribute.js';
import {
  SchemaAttribute,
  SchemaAttributeType,
  SchemaReferenceAttribute,
  SchemaSelectAttribute,
} from '../entities/Schema.js';

const isSchemaReferenceAttribute = (
  attribute: SchemaAttribute | SchemaReferenceAttribute | SchemaSelectAttribute
): attribute is SchemaReferenceAttribute => {
  return attribute.type === SchemaAttributeType.Reference ? true : false;
};

const getSchemaReferenceAttributes = (
  attributes?: SchemaAttribute[]
): SchemaReferenceAttribute[] => {
  if (!attributes) {
    return [];
  }

  return attributes.filter((attribute) =>
    isSchemaReferenceAttribute(attribute)
  ) as SchemaReferenceAttribute[];
};

const getCreatedReference = (
  reference: SchemaReferenceAttribute,
  updated: Attribute = {},
  original: Attribute = {}
) => {
  return updated.hasOwnProperty(reference.key) && !original.hasOwnProperty(reference.key)
    ? new ObjectId(updated[reference.key]!)
    : null;
};

const getDeletedReference = (
  reference: SchemaReferenceAttribute,
  updated: Attribute = {},
  original: Attribute = {}
) => {
  return original.hasOwnProperty(reference.key) && !updated.hasOwnProperty(reference.key)
    ? new ObjectId(original[reference.key]!)
    : null;
};

const getChangedReference = (
  reference: SchemaReferenceAttribute,
  updated: Attribute = {},
  original: Attribute = {}
) => {
  return updated.hasOwnProperty(reference.key) &&
    original.hasOwnProperty(reference.key) &&
    updated[reference.key] !== original[reference.key]
    ? {
        updatedId: new ObjectId(updated[reference.key]!),
        originalId: new ObjectId(original[reference.key]!),
      }
    : null;
};

export const SchemaHelper = {
  isSchemaReferenceAttribute,
  getSchemaReferenceAttributes,
  getCreatedReference,
  getChangedReference,
  getDeletedReference,
};
