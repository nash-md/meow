import 'reflect-metadata';

export const ENTITY_METADATA_KEY = Symbol('EntityMetadata');
export const BEFORE_UPDATE_METADATA_KEY = Symbol('BeforeUpdate');
export const BEFORE_INSERT_METADATA_KEY = Symbol('BeforeInsert');

interface EntityOptions {
  name: string;
}

interface ColumnOptions {
  type?: string;
}

export function Entity(options: EntityOptions) {
  return function (constructor: Function) {
    console.log(`Setting metadata for entity ${constructor.name}`);
    Reflect.defineMetadata(ENTITY_METADATA_KEY, options, constructor);
  };
}

export function getEntityMetadata(target: Function): EntityOptions {
  const entityMetadata = Reflect.getMetadata(ENTITY_METADATA_KEY, target);
  if (!entityMetadata) {
    throw new Error('Entity metadata not found for ' + target.name); // TODO
  }

  return entityMetadata;
}

export function BeforeInsert(options: ColumnOptions = {}) {
  return function (target: any, propertyKey: string) {
    const existingColumns = Reflect.getMetadata(BEFORE_INSERT_METADATA_KEY, target) || [];
    existingColumns.push({ name: propertyKey, ...options });
    Reflect.defineMetadata(BEFORE_INSERT_METADATA_KEY, existingColumns, target);
  };
}

export function getBeforeInsertMethods(target: Function): { name: string }[] {
  return Reflect.getMetadata(BEFORE_INSERT_METADATA_KEY, target.prototype) || [];
}

export function BeforeUpdate(options: ColumnOptions = {}) {
  return function (target: any, propertyKey: string) {
    const existingColumns = Reflect.getMetadata(BEFORE_UPDATE_METADATA_KEY, target) || [];
    existingColumns.push({ name: propertyKey, ...options });

    Reflect.defineMetadata(BEFORE_UPDATE_METADATA_KEY, existingColumns, target);
  };
}

export function getBeforeUpdateMethods(target: Function): { name: string }[] {
  return Reflect.getMetadata(BEFORE_UPDATE_METADATA_KEY, target.prototype) || [];
}
