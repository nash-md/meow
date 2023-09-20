import { Card } from './Card';
import { Lane } from './Lane';

export interface Board {
  [key: Lane['_id']]: Card['_id'][];
}
