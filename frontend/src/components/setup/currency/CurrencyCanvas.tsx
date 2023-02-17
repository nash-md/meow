import { Picker, Item } from '@adobe/react-spectrum';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ActionType,
  showModalError,
  showModalSuccess,
} from '../../../actions/Actions';
import { RequestHelperContext } from '../../../context/RequestHelperContextProvider';
import { CurrencyCode } from '../../../interfaces/Account';
import { selectCurrency, selectAccountId, store } from '../../../store/Store';

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

export const CurrencyCanvas = () => {
  const { client } = useContext(RequestHelperContext);

  const configuredCurrency = useSelector(selectCurrency);
  const accountId = useSelector(selectAccountId);
  const [currency, setCurrency] = useState<CurrencyCode>(
    configuredCurrency ?? CurrencyCode.USD
  );

  const updateCurrencyCode = async (key: React.Key) => {
    const c = parseCurrencyKey(key);

    setCurrency(c);

    try {
      await client!.updateAccount(accountId!, c);

      store.dispatch(showModalSuccess());

      store.dispatch({
        type: ActionType.ACCOUNT_UPDATE,
        payload: currency,
      });
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

  return (
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
  );
};