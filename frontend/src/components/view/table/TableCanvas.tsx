import { ReactComponentElement } from 'react';

interface TableCanvasProps {
  children: React.ReactNode;
}

export const TableCanvas = ({ children }: TableCanvasProps) => {
  return (
    <table className="desktop-view" style={{ width: '100%' }}>
      <tbody>{children}</tbody>
    </table>
  );
};
