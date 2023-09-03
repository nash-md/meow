interface RowProps {
  key: number;
  children: React.ReactNode;
}

export const Row = ({ children }: RowProps) => {
  return <tr>{children}</tr>;
};
