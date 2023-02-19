import { Item, Picker } from '@adobe/react-spectrum';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { showModalError, showModalSuccess } from '../../actions/Actions';
import { RequestHelperContext } from '../../context/RequestHelperContextProvider';
import { selectAnimal, selectUserId, store } from '../../store/Store';

export const AnimalCanvas = () => {
  const { client } = useContext(RequestHelperContext);
  const userId = useSelector(selectUserId);
  const animalDefault = useSelector(selectAnimal);

  const [animal, setAnimal] = useState(animalDefault);

  const updateUser = async (key: React.Key) => {
    setAnimal(key.toString());

    try {
      await client!.updateUser(userId!, key.toString());

      store.dispatch(showModalSuccess());
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

  return (
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
          defaultSelectedKey={animal}
          onSelectionChange={updateUser}
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
  );
};
