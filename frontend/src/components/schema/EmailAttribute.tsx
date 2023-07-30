import { TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

export interface EmailAttributeProps {
  attributeKey: string;
  name: string;
  value: string | null;
  isDisabled: boolean;
  update: (index: string, value: string) => void;
}

export const EmailAttribute = ({
  attributeKey,
  name,
  value: valueDefault,
  update,
  isDisabled,
}: EmailAttributeProps) => {
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
        label={`${name} (email)`}
        value={value?.toString()}
        isDisabled={isDisabled}
        onChange={(value) => updateValue(value)}
      />
    </div>
  );
};
