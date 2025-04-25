import { DialogContainer, Button } from '@adobe/react-spectrum';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { getRequestClient } from '../../helpers/RequestHelper';
import { selectToken, selectTeam, store } from '../../store/Store';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

export const AllowTeamRegistrationModal = () => {
  const token = useSelector(selectToken);
  const team = useSelector(selectTeam);

  let [isOpen, setOpen] = useState(true);

  const client = getRequestClient(token);

  const update = async (allowTeamRegistration: boolean) => {
    const payload = await client.allowTeamRegistration(team!._id, allowTeamRegistration);

    store.dispatch({
      type: ActionType.TEAM_UPDATE,
      payload: payload,
    });

    setOpen(false);
  };

  return (
    <DialogContainer type="fullscreenTakeover" onDismiss={() => setOpen(false)}>
      {isOpen && (
        <div className="allow-team-registration-modal">
          <h1>
            {Translations.WelcomeMessage[DEFAULT_LANGUAGE]}
          </h1>
          {Translations.TeamRegistrationQuestion[DEFAULT_LANGUAGE]}
          <div className="confirmation-canvas">
            <Button onPress={() => update(true)} variant="primary">
              {Translations.AllowTeamRegistrationsButton[DEFAULT_LANGUAGE]}
            </Button>
            &nbsp; &nbsp;
            <Button onPress={() => update(false)} variant="accent">
              {Translations.RestrictToMyTeamButton[DEFAULT_LANGUAGE]}
            </Button>
          </div>
        </div>
      )}
    </DialogContainer>
  );
};
