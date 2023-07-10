import { PropsWithChildren } from 'react';
import { Navigation } from './Navigation';
import { NavigationMobile } from './NavigationMobile';
import useMobileLayout from '../hooks/useMobileLayout';

export const Layout = (props: PropsWithChildren<unknown>) => {
  const isMobileLayout = useMobileLayout();

  return (
    <div className="page">
      <div className="navigation">{isMobileLayout ? <NavigationMobile /> : <Navigation />}</div>
      <div className="main">{props.children}</div>
    </div>
  );
};
