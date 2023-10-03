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
  latest: Attribute = {},
  previous?: Attribute
) => {
  if (!previous) {
    return latest.hasOwnProperty(reference.key) ? new ObjectId(latest[reference.key]!) : null;
  }

  return latest.hasOwnProperty(reference.key) && !previous.hasOwnProperty(reference.key)
    ? new ObjectId(latest[reference.key]!)
    : null;
};

const getDeletedReference = (
  reference: SchemaReferenceAttribute,
  latest: Attribute = {},
  previous?: Attribute
) => {
  if (!previous) {
    return null;
  }

  return previous.hasOwnProperty(reference.key) && !latest.hasOwnProperty(reference.key)
    ? new ObjectId(previous[reference.key]!)
    : null;
};

const getChangedReference = (
  reference: SchemaReferenceAttribute,
  latest: Attribute = {},
  previous?: Attribute
) => {
  if (!previous) {
    return null;
  }

  return latest.hasOwnProperty(reference.key) &&
    previous.hasOwnProperty(reference.key) &&
    latest[reference.key] !== previous[reference.key]
    ? {
        latestId: new ObjectId(latest[reference.key]!),
        previousId: new ObjectId(previous[reference.key]!),
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
