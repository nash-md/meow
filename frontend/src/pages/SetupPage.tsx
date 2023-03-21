import { useContext, useEffect } from 'react';
import { store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { CurrencyCanvas } from '../components/setup/currency/CurrencyCanvas';
import { LanesCanvas } from '../components/setup/lane/LaneCanvas';
import { CardSchema } from '../components/setup/card/CardSchema';
import { AccountSchema } from '../components/setup/account/AccountSchema';

export const SetupPage = () => {
  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    const execute = async () => {
      let lanes = await client!.getLanes();

      store.dispatch({
        type: ActionType.LANES,
        payload: [...lanes],
      });

      let schemas = await client!.fetchSchemas();

      store.dispatch({
        type: ActionType.SCHEMAS,
        payload: [...schemas],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  return (
    <div className="canvas">
      <CurrencyCanvas />
      <LanesCanvas />
      <CardSchema />
      <AccountSchema />
    </div>
  );
};
