import { Button, Item, Picker } from '@adobe/react-spectrum';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, showModalError, showModalSuccess } from '../../../actions/Actions';
import {
  selectAnimal,
  selectColor,
  selectToken,
  selectUserId,
  selectUsers,
  store,
} from '../../../store/Store';
import { Translations } from '../../../Translations';
import { USER_COLORS, DEFAULT_LANGUAGE } from '../../../Constants';
import { ColorCircleSelected } from './ColorCircleSelected';
import { ColorCircle } from './ColorCircle';
import { getRequestClient } from '../../../helpers/RequestHelper';


export const FormCanvas = () => {
  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const userId = useSelector(selectUserId);
  const users = useSelector(selectUsers);
  const animalDefault = useSelector(selectAnimal);
  const colorDefault = useSelector(selectColor);

  const [avatarColor, setAvatarColor] = useState<string | undefined>(colorDefault);
  const [animal, setAnimal] = useState(animalDefault);

  const save = async () => {
    const user = users.find((user) => user._id === userId)!;

    if (!user) {
      return;
    }

    user.animal = animal;
    user.color = avatarColor;

    try {
      const updated = await client.updateUser(user);

      store.dispatch({
        type: ActionType.USER_SETTINGS_UPDATE,
        payload: updated,
      });

      store.dispatch(showModalSuccess(Translations.SetupChangedConfirmation[DEFAULT_LANGUAGE]));
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

  return (
    <div className="content-box">
      <h2>If You Were An Animal What Would You Be?</h2>
      <span style={{ fontSize: '0.8em', display: 'block', marginBottom: '10px' }}>
        This information will definitely be shared with your coworkers
      </span>

      <div style={{ marginBottom: '20px' }}>
        <div>
          <Picker
            selectedKey={animal}
            aria-label="Animal"
            defaultSelectedKey={animal}
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
      <h2>Your Color</h2>

      <div style={{ paddingTop: '10px', display: 'flex' }}>
        {USER_COLORS.map((color) => {
          return avatarColor === color ? (
            <ColorCircleSelected key={color} color={color} setColor={setAvatarColor} />
          ) : (
            <ColorCircle key={color} color={color} setColor={setAvatarColor} />
          );
        })}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Button variant="primary" onPress={save}>
          Save
        </Button>
      </div>
    </div>
  );
};
