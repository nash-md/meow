import { PropsWithChildren } from 'react';
import { Navigation } from './Navigation';

export const Layout = (props: PropsWithChildren<unknown>) => {
  return (
    <div className="page">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="main">{props.children}</div>
    </div>
  );
};
