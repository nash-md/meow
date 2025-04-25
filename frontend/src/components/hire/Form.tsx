import { Button, TextField } from '@adobe/react-spectrum';
import { useState, useMemo } from 'react';
import { ActionType, showModalSuccess } from '../../actions/Actions';
import { selectToken, store } from '../../store/Store';
import { getErrorMessage } from '../../helpers/ErrorHelper';
import { UserHelper } from '../../helpers/UserHelper';
import { useSelector } from 'react-redux';
import { getRequestClient } from '../../helpers/RequestHelper';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

export const Form = (props: any) => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  let isValidForm = useMemo(() => {
    return UserHelper.isValidName(name);


  }, [name]);

  const save = async () => {
    setError('');

    try {
      const user = await client.createUser(name); // TODO remove any

      setName('');

      store.dispatch({
        type: ActionType.USER_ADD,
        payload: user,
      });

      store.dispatch(showModalSuccess(Translations.UserCreatedConfirmation[DEFAULT_LANGUAGE]));
    } catch (error) {
      console.error(error);

      setError(await getErrorMessage(error));
    }
  };

  return (
    <div className="content-box">
      <h2>{Translations.CreateNewUserTitle[DEFAULT_LANGUAGE]}</h2>
      <div className="create-user-form">
        <div>
          <TextField
            onChange={setName}
            onBlur={() => setName(name.trim())}
            value={name}
            aria-label={Translations.NameLabel[DEFAULT_LANGUAGE]}
            width="100%"
            key="name"
            label={Translations.NameLabel[DEFAULT_LANGUAGE]}
          />
        </div>

        <div className="send-button">
          <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
            {Translations.CreateButton[DEFAULT_LANGUAGE]}
          </Button>
        </div>
      </div>
      <div style={{ color: 'red', paddingTop: '5px' }}> {error}</div>
    </div>
  );
};
