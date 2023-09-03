interface ItemProps {
  children: React.ReactNode;
  key: number;
}

export const Item = ({ children }: ItemProps) => {
  return <div className="item">{children}</div>;
};
