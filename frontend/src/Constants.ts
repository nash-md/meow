export const lanes = [
  { key: 'not-qualified', name: 'Not Qualified', inForecast: false },
  { key: 'qualified', name: 'Qualified', inForecast: false },
  { key: 'comitted', name: 'Comitted', inForecast: false },
  { key: 'closed-won', name: 'Closed Won', color: '#00b359', inForecast: true },
  {
    key: 'closed-lost',
    name: 'Closed Lost',
    color: '#e30544',
    inForecast: true,
  },
  { key: 'trash', name: 'Trash', isHidden: true },
] as const;

export type LaneKey = typeof lanes[number]['key'];

export const colors = ['#067BC2', '#067BC2', '#ECC30B', '#F37748', '#D56062'];
