import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '../Constants';

export function generateUUID() {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += Math.floor(Math.random() * 16).toString(16);
  }
  return uuid;
}

export function isValidId(value: string): boolean {
  if (typeof value !== 'string' || value.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(value)) {
    return false;
  }
  return true;
}

export const getBrowserLocale = () => {
  if (!Intl || !Intl.Locale) {
    return `${DEFAULT_LANGUAGE}-${DEFAULT_REGION}`;
  }

  const locale = new Intl.Locale(navigator.language ?? DEFAULT_LANGUAGE);

  return locale.region ? `${locale.language}-${locale.region}` : locale.language;
};

export function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function hasDuplicateEntries(array: string[]): boolean {
  return array.some((value, index) => {
    return array.indexOf(value) !== index;
  });
}
