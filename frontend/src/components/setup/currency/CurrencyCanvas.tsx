import { Picker, Item } from '@adobe/react-spectrum';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, showModalError, showModalSuccess } from '../../../actions/Actions';
import { CurrencyCode } from '../../../interfaces/Team';
import { selectCurrency, selectTeam, selectToken, store } from '../../../store/Store';
import { Translations } from '../../../Translations';
import { getRequestClient } from '../../../helpers/RequestHelper';
import { DEFAULT_LANGUAGE } from '../../../Constants'

function parseCurrencyKey(value: React.Key): CurrencyCode {
    switch (value) {
        case 'USD':
            return CurrencyCode.USD;
        case 'EUR':
            return CurrencyCode.EUR;
        case 'SEK':
            return CurrencyCode.SEK;
        case 'MT2':
            return CurrencyCode.MT2;
        case 'GBP':
            return CurrencyCode.GPB;
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
            console.error(Translations.TeamNotSetError[DEFAULT_LANGUAGE]);
        }

        const c = parseCurrencyKey(key);

        setCurrency(c);

        try {
            const payload = await client.updateTeam(team!._id, c);

            store.dispatch(showModalSuccess(Translations.SetupChangedConfirmation[DEFAULT_LANGUAGE]));

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
            <h2>{Translations.CurrencyTitle[DEFAULT_LANGUAGE]}</h2>
            <Picker
                selectedKey={currency}
                aria-label={Translations.CurrencyTitle[DEFAULT_LANGUAGE]}
                onSelectionChange={(key) => updateCurrencyCode(key)}
                marginTop="10px"
            >
                <Item key="USD">{Translations.USDollarOption[DEFAULT_LANGUAGE]}</Item>
                <Item key="EUR">{Translations.EuroOption[DEFAULT_LANGUAGE]}</Item>
                <Item key="SEK">{Translations.SwedishKronaOption[DEFAULT_LANGUAGE]}</Item>
                <Item key="MT2">{Translations.M2Option[DEFAULT_LANGUAGE]}</Item>
                <Item key="GBP">{Translations.GBPOption[DEFAULT_LANGUAGE]}</Item>
            </Picker>
        </div>
    );
};
