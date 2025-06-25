import { Translations } from '../../../Translations';
import { DEFAULT_LANGUAGE } from '../../../Constants';

export const CreatedAt = () => {
  return <div className="body">{Translations.OpportunityCreated[DEFAULT_LANGUAGE]}</div>;
};
