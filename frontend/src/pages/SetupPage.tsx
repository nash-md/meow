import { useContext, useEffect, useState } from 'react';
import { store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { AnimalCanvas } from '../components/setup/AnimalCanvas';
import { CardCanvas } from '../components/setup/card/CardCanvas';
import { CurrencyCanvas } from '../components/setup/currency/CurrencyCanvas';
import { LanesCanvas } from '../components/setup/lane/LaneCanvas';
import { PasswordCanvas } from '../components/setup/PasswordCanvas';

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

      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
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

      <PasswordCanvas />
    </div>
  );
};
