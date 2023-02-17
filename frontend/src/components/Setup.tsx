import { useContext, useEffect, useState } from 'react';
import { Item, Picker } from '@adobe/react-spectrum';
import { selectAccountId, selectCurrency, store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { useSelector } from 'react-redux';
import { CurrencyCode } from '../interfaces/Account';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { LanesCanvas } from './setup/lane/LaneCanvas';
import { CardCanvas } from './setup/card/CardCanvas';
import { CurrencyCanvas } from './setup/currency/CurrencyCanvas';

export const Setup = () => {
  const { client } = useContext(RequestHelperContext);

  const [animal, setAnimal] = useState('');

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

      <div className="content-box">
        <h2>If You Were An Animal What Would You Be?</h2>
        <span
          style={{ fontSize: '0.8em', display: 'block', marginBottom: '10px' }}
        >
          This information will definitely be shared with your coworkers
        </span>
        <div>
          <Picker
            selectedKey={animal}
            aria-label="Animal"
            onSelectionChange={(key) => setAnimal(key.toString())}
          >
            <Item key="horse">Horse</Item>
            <Item key="racoon">Raccoon</Item>
            <Item key="cat">Cat</Item>
            <Item key="dog">Dog</Item>
            <Item key="bird">Bird</Item>
            <Item key="no-answer">I don't want to answer</Item>
          </Picker>
        </div>
        {animal === 'no-answer' && (
          <div style={{ color: 'red' }}>
            Warning: This answer will slow down your career progression.
          </div>
        )}
      </div>
    </div>
  );
};
