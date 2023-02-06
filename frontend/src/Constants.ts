export interface Lane {
  key: string;
  name: string;
  color?: string;
  isEnd?: boolean;
}

export const lanes = [
  { key: 'not-qualified', name: 'Not Qualified' },
  { key: 'qualified', name: 'Qualified' },
  { key: 'comitted', name: 'Comitted' },
  { key: 'closed-won', name: 'Closed Won', color: '#00b359', isEnd: true },
  { key: 'closed-lost', name: 'Closed Lost', color: '#e30544', isEnd: true },
  { key: 'trash', name: 'Trash', isHidden: true },
] as const;

export type LaneKey = typeof lanes[number]['key'];

export const colors = ['#067BC2', '#067BC2', '#ECC30B', '#F37748', '#D56062'];
