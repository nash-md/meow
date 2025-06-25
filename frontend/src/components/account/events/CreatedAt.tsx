import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

export const CreatedAt = () => {
  return <div className="body">{Translations.AccountCreatedConfirmation[DEFAULT_LANGUAGE]}</div>;
};
