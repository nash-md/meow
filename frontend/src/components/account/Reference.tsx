import { useEffect, useState } from 'react';
import { Account } from '../../interfaces/Account';
import { Reference as ReferenceInterface } from '../../interfaces/Reference';
import { ReferenceItem } from './ReferenceItem';

export interface ReferenceProps {
  account?: Account;
}

export const Reference = ({ account }: ReferenceProps) => {
  const [references, setReferences] = useState<ReferenceInterface[]>([]);

  useEffect(() => {
    if (account && account.references && Array.isArray(account.references)) {
      setReferences(account.references);
    }
  }, [account]);

  return (
    <div>
      {references?.map((reference, index) => {
        return <ReferenceItem key={index} reference={reference} />;
      })}
    </div>
  );
};
