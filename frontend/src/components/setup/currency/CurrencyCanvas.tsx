import { Picker, Item } from '@adobe/react-spectrum';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, showModalError, showModalSuccess } from '../../../actions/Actions';
import { CurrencyCode } from '../../../interfaces/Team';
import { selectCurrency, selectTeam, selectTeamId, selectToken, store } from '../../../store/Store';
import { Translations } from '../../../Translations';
import { getRequestClient } from '../../../helpers/RequestHelper';

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
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const configuredCurrency = useSelector(selectCurrency);
  const team = useSelector(selectTeam);
  const [currency, setCurrency] = useState<CurrencyCode>(configuredCurrency ?? CurrencyCode.USD);

  const updateCurrencyCode = async (key: React.Key) => {
    if (!team) {
      console.error('Team not set');
    }

    const c = parseCurrencyKey(key);

    setCurrency(c);

    try {
      const payload = await client.updateTeam(team!._id, c);

      store.dispatch(showModalSuccess(Translations.SetupChangedConfirmation.en));

      store.dispatch({
        type: ActionType.TEAM_UPDATE,
        payload: { ...team!, currency: payload.currency, integrations: payload.integrations },
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
