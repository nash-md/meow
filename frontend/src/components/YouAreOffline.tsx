import { Translations } from '../Translations';
import { DEFAULT_LANGUAGE } from '../Constants';

export const YouAreOffline = () => {
  return (
    <div className="you-are-offline">
      <img src="/offline-icon.svg" alt="offline icon"/>
      &nbsp; &nbsp;{Translations.YouAreOffline[DEFAULT_LANGUAGE]}
    </div>
  );
};
