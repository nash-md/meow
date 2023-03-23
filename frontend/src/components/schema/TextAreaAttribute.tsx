import { TextArea } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';

export interface TextAreaAttributeProps {
  attributeKey: string;
  name: string;
  value: string | number | undefined;
  update: (index: string, value: string) => void;
}

export const TextAreaAttribute = ({
  attributeKey,
  name,
  update,
  value: valueDefault,
}: TextAreaAttributeProps) => {
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
      <TextArea
        width="100%"
        aria-label={name}
        label={name}
        value={value?.toString()}
        onChange={(value) => updateValue(value)}
      />
    </div>
  );
};
