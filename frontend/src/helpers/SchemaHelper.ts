import {
  SchemaAttribute,
  SchemaAttributeType,
  SchemaReferenceAttribute,
  SchemaSelectAttribute,
} from '../interfaces/Schema';

const isReferenceAttribute = (
  attribute: SchemaAttribute | SchemaReferenceAttribute | SchemaSelectAttribute
): attribute is SchemaReferenceAttribute => {
  return 'entity' in attribute && attribute.type === SchemaAttributeType.Reference ? true : false;
};

const isSelectAttribute = (
  attribute: SchemaAttribute | SchemaReferenceAttribute | SchemaSelectAttribute
): attribute is SchemaSelectAttribute => {
  return 'options' in attribute && attribute.type === SchemaAttributeType.Select ? true : false;
};

const isSchemaAttribute = (
  attribute: SchemaAttribute | SchemaReferenceAttribute | SchemaSelectAttribute
): attribute is SchemaReferenceAttribute => {
  return 'reference' in attribute && attribute.type === SchemaAttributeType.Reference
    ? true
    : false;
};

export const SchemaHelper = {
  isReferenceAttribute,
  isSelectAttribute,
  isSchemaAttribute,
};
