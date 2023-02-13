import { useContext, useEffect, useState } from 'react';
import { Item, Picker } from '@adobe/react-spectrum';
import { selectAccountId, selectCurrency, store } from '../store/Store';
import { ActionType } from '../actions/Actions';
import { useSelector } from 'react-redux';
import { CurrencyCode } from '../interfaces/Account';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Funnel } from './Funnel';

export const Setup = () => {
  const { client } = useContext(RequestHelperContext);

  const configuredCurrency = useSelector(selectCurrency);
  const accountId = useSelector(selectAccountId);
  const [animal, setAnimal] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(
    configuredCurrency ?? CurrencyCode.USD
  );

  function parseCurrencyKey(value: React.Key): CurrencyCode {
    switch (value) {
      case 'USD':
        return CurrencyCode.USD;
      case 'EUR':
        return CurrencyCode.EUR;
      case 'SEK':
        return CurrencyCode.SEK;
      default:
        throw new Error(`Unsupported value: ${value}`);
    }
  }

  const updateCurrencyCode = async (key: React.Key) => {
    const currency = parseCurrencyKey(key);

    setCurrency(currency);

    store.dispatch({
      type: ActionType.ACCOUNT_UPDATE,
      payload: currency,
    });

    await client!.updateAccount(accountId!, currency);
  };

  useEffect(() => {
    const execute = async () => {
      let lanes = await client!.getLanes();

      store.dispatch({
        type: ActionType.LANES,
        payload: [...lanes],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  return (
    <div className="canvas">
      <div className="content-box">
        <h2>Currency</h2>
        <Picker
          selectedKey={currency}
          aria-label="Currency"
          onSelectionChange={(key) => updateCurrencyCode(key)}
          marginTop="10px"
        >
          <Item key="USD">US Dollar</Item>
          <Item key="EUR">Euro</Item>
          <Item key="SEK">Swedish Krona</Item>
        </Picker>
      </div>

      <Funnel />

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
