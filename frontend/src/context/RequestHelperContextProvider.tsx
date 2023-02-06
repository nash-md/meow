import React, { createContext, useState } from 'react';
import { RequestHelper } from '../helpers/RequestHelper';

interface RequestHelperContextType {
  client: RequestHelper | undefined;
  setClient:
    | React.Dispatch<React.SetStateAction<RequestHelper | undefined>>
    | undefined;
}

export const RequestHelperContext = createContext<RequestHelperContextType>({
  client: undefined,
  setClient: undefined,
});

export const RequestHelperContextProvider = (props: any) => {
  const [client, setClient] = useState<RequestHelper | undefined>();

  return (
    <RequestHelperContext.Provider
      value={{
        client,
        setClient,
      }}
    >
      {props.children}
    </RequestHelperContext.Provider>
  );
};
