import { useState } from 'react';
import { Item, Picker } from '@adobe/react-spectrum';

export const Setup = () => {
  const [animal, setAnimal] = useState('');
  const [currency, setCurrency] = useState('');

  return (
    <div>
      <h2>Currency</h2>

      <Picker
        selectedKey={currency}
        aria-label="ddd"
        onSelectionChange={(key) => setCurrency(key.toString())}
      >
        <Item key="horse">Dollar</Item>
        <Item key="racoon">Euro</Item>
      </Picker>

      <h2 style={{ marginBottom: '5px' }}>
        If You Were An Animal What Would You Be?
      </h2>
      <span
        style={{ fontSize: '0.8em', display: 'block', marginBottom: '10px' }}
      >
        This information will definitely be shared with your coworkers
      </span>
      <div>
        <Picker
          selectedKey={animal}
          aria-label="ddd"
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
  );
};
