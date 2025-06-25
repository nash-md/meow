import { useEffect, useState } from 'react';
import { ListName } from '../../store/ApplicationStore';
import { store } from '../../store/Store';
import { setListViewFilterBy } from '../../actions/Actions';
import { Translations } from '../../Translations';
import { DEFAULT_LANGUAGE } from '../../Constants';

export interface ListSearchCanvasProps {
  name: ListName;
}

export const ListSearchCanvas = ({ name }: ListSearchCanvasProps) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    store.dispatch(setListViewFilterBy(name, search));
  }, [search]);

  return (
    <div className="search-by-name">
      <input
        onChange={(event) => setSearch(event.target.value)}
        value={search}
        aria-label={Translations.SearchByNamePlaceholder[DEFAULT_LANGUAGE]}
        placeholder={Translations.SearchByNamePlaceholder[DEFAULT_LANGUAGE]}
        type="text"
      />
    </div>
  );
};
