export interface ListView {
  sortBy: {
    direction: ListViewSortDirection;
    column?: string;
  };
  filterBy: {
    text?: string;
  };
  columns: ListViewItem[];
}

export type ListViewSortDirection = 'asc' | 'desc';

export interface ListViewItem {
  name: string | null;
  column: string | null;
  isHidden: boolean;
}

export interface DataRow {
  id: string;
  name: string;
  [key: string]: string | number | null | boolean | undefined;
}

// TODO rename to TableView
