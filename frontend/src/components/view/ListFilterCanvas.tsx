import { useState } from 'react';
import { IconHide } from '../IconHide';
import { ListViewItem } from '../../interfaces/ListView';
import { Checkbox } from '@adobe/react-spectrum';
import { setListViewColumn } from '../../actions/Actions';
import { store } from '../../store/Store';
import { ListName } from '../../store/ApplicationStore';

export interface ListFilterCanvasProps {
  columns: ListViewItem[];
  name: ListName;
}

export const ListFilterCanvas = ({ columns, name }: ListFilterCanvasProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleLayer = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="filter-canvas">
      <div className="toggle" onClick={toggleLayer}>
        <div>
          <IconHide />
        </div>
      </div>

      {isVisible && (
        <div>
          {columns.map((item) => {
            return (
              <div className="column">
                <Checkbox
                  key={item.column}
                  isSelected={item.isHidden}
                  onChange={(value) => {
                    const list = columns.map((i) =>
                      i.column === item.column ? { ...i, isHidden: value } : i
                    );

                    store.dispatch(setListViewColumn(name, list));
                  }}
                />

                <div className="name">{item.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
