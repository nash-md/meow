import { useContext, useEffect, useState } from 'react';
import { store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { LanesCanvas } from './setup/lane/LaneCanvas';
import { CardCanvas } from './setup/card/CardCanvas';
import { CurrencyCanvas } from './setup/currency/CurrencyCanvas';
import { AnimalCanvas } from './setup/AnimalCanvas';

export const Setup = () => {
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

      <CardCanvas />

      <AnimalCanvas />
    </div>
  );
};
