import { Button, TextField } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

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

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!value) {
      setIsValid(false);
      return;
    }

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsValid(pattern.test(value));
  }, [value]);

  const handleEmailClick = (email: string | null) => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent('tbd')}`;

    console.log(mailtoLink);

    window.open(mailtoLink, 'mail');
  };

  return (
    <div className="attribute email-attribute">
      <TextField
        width="100%"
        aria-label={name}
        label={`${name} ${Translations.EmailLabelSuffix[DEFAULT_LANGUAGE]}`}
        value={value?.toString()}
        isDisabled={isDisabled}
        onChange={(value) => updateValue(value)}
      />
      <div className="send">
        <Button isDisabled={!isValid} onPress={() => handleEmailClick(value)} variant="secondary">
          {Translations.SendButton[DEFAULT_LANGUAGE]}
        </Button>
      </div>
    </div>
  );
};
