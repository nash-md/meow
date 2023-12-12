import { DialogContainer, Button } from '@adobe/react-spectrum';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../../actions/Actions';
import { getRequestClient } from '../../helpers/RequestHelper';
import { selectToken, selectTeam, store } from '../../store/Store';

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
            Welcome to our Meow! Before you dive in, take a moment to configure how you'd like your
            workspace to function
          </h1>
          Would you like to allow other people to register and create their own teams on your
          workspace? Remember that regardless of your choice, you will still have the ability to
          manage your own team and add individual users to it. This decision simply affects the
          creation of new teams by others.
          <div className="confirmation-canvas">
            <Button onPress={() => update(true)} variant="primary">
              Allow Team Registrations
            </Button>
            &nbsp; &nbsp;
            <Button onPress={() => update(false)} variant="accent">
              Restrict to My Team Only
            </Button>
          </div>
        </div>
      )}
    </DialogContainer>
  );
};
