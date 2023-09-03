interface RowProps {
  index: number;
  children: React.ReactNode;
}

export const Row = ({ children, index }: RowProps) => {
  return <tr key={index}>{children}</tr>;
};
