interface CreatedAtProps {
  entity: 'card' | 'account';
}

export const CreatedAt = ({ entity }: CreatedAtProps) => {
  switch (entity) {
    case 'account':
      return <div className="body">Account created...</div>;
    case 'card':
      return <div className="body">Opportunity created...</div>;
  }
};
