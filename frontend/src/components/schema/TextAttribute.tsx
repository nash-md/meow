import { TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

export interface TextAttributeProps {
  attributeKey: string;
  name: string;
  value: string | null;
  update: (index: string, value: string) => void;
}

export const TextAttribute = ({
  attributeKey,
  name,
  value: valueDefault,
  update,
}: TextAttributeProps) => {
  const [value, setValue] = useState(valueDefault);

  useEffect(() => {
    setValue(valueDefault);
  }, [valueDefault]);

  const updateValue = (value: string) => {
    setValue(value);
    update(attributeKey, value);
  };

  return (
    <div className="attribute">
      <TextField
        width="100%"
        aria-label={name}
        label={name}
        value={value?.toString()}
        onChange={(value) => updateValue(value)}
      />
    </div>
  );
};
