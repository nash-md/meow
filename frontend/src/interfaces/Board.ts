import { Card } from './Card';
import { Lane } from './Lane';

export interface Board {
  [key: Lane['id']]: Card['id'][];
}
