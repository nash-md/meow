import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '../Constants';

function generateUUID() {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += Math.floor(Math.random() * 16).toString(16);
  }
  return uuid;
}

const getBrowserLocale = () => {
  if (!Intl || !Intl.Locale) {
    return `${DEFAULT_LANGUAGE}-${DEFAULT_REGION}`;
  }

  const locale = new Intl.Locale(navigator.language ?? DEFAULT_LANGUAGE);

  return locale.region
    ? `${locale.language}-${locale.region}`
    : locale.language;
};

export const Helper = {
  generateUUID,
  getBrowserLocale,
};
