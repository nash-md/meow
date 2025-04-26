import { Button, TextField } from '@adobe/react-spectrum';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { showModalError, showModalSuccess } from '../../actions/Actions';
import { selectToken, selectUserId, store } from '../../store/Store';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';
import { getRequestClient } from '../../helpers/RequestHelper';

export const PasswordCanvas = () => {
  const id = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [existing, setExisting] = useState<string>('');
  const [updated, setUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');

  let isValid = useMemo(() => {
    setError('');

    return existing.length >= 3 && updated.length >= 3;


  }, [existing, updated]);

  const save = async () => {
    setExisting('');
    setUpdated('');

    try {
      await client.updatePassword(id!, existing, updated);

      store.dispatch(showModalSuccess(Translations.PasswordChangedConfirmation[DEFAULT_LANGUAGE]));
    } catch (error: any) {
      if (error?.response.status === 401) {
        setError(Translations.CurrentPasswordInvalidError[DEFAULT_LANGUAGE]);
      } else {
        store.dispatch(showModalError(error?.toString()));
      }
    }
  };

  return (
    <div className="content-box">
      <h2>{Translations.ChangeYourPasswordTitle[DEFAULT_LANGUAGE]}</h2>

      <div style={{ marginTop: '10px', width: '200px' }}>
        <TextField
          onChange={setExisting}
          value={existing}
          aria-label={Translations.CurrentPasswordLabel[DEFAULT_LANGUAGE]}
          width="100%"
          type="password"
          key="name"
          label={Translations.CurrentPasswordLabel[DEFAULT_LANGUAGE]}
        />
      </div>

      <div style={{ marginTop: '10px', width: '200px' }}>
        <TextField
          onChange={setUpdated}
          value={updated}
          type="password"
          aria-label={Translations.NewPasswordLabel[DEFAULT_LANGUAGE]}
          width="100%"
          key="name"
          label={Translations.NewPasswordLabel[DEFAULT_LANGUAGE]}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <Button variant="primary" onPress={save} isDisabled={!isValid}>
          {Translations.SaveButton[DEFAULT_LANGUAGE]}
        </Button>
      </div>
      <div style={{ paddingTop: '10px' }}>{error}</div>
    </div>
  );
};
