export interface LocalStorageContext {
  token?: string;
}

const writeValue = (key: string, value: string | undefined) => {
  if (value && value === readValue(key)) {
    return;
  }

  if (!value && !readValue(key)) {
    return;
  }

  if (value) {
    console.log(`persist ${key} with ${value}`);

    window.localStorage.setItem(key, value);
  } else {
    console.log(`remove ${key} from local storage`);
    window.localStorage.removeItem(key);
  }
};

const readValue = (key: string) => {
  const value = window.localStorage.getItem(key);

  if (value !== null) {
    return value;
  }
};

export const writeContextToLocalStorage = (context: LocalStorageContext) => {
  if (!window.localStorage) {
    console.log(`browser has no local storage object, cannot persist value`);
    return;
  }

  writeValue('token', context.token);

  return context;
};

export const readContextFromLocalStorage = () => {
  const context: LocalStorageContext = {};

  if (!window.localStorage) {
    console.log(
      `browser has no local storage object, cannot load persisted value`
    );
    return context;
  }

  context.token = readValue('token');

  return context;
};
