interface ItemProps {
  children: React.ReactNode;
}

export const Item = ({ children }: ItemProps) => {
  return <div className="item">{children}</div>;
};
