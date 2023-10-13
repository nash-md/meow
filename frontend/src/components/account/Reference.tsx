import { useEffect, useState } from 'react';
import { Account } from '../../interfaces/Account';
import { Reference as ReferenceInterface } from '../../interfaces/Reference';
import { ReferenceItem } from './ReferenceItem';
import { SchemaReferenceAttribute } from '../../interfaces/Schema';

export interface ReferenceProps {
  attribute: SchemaReferenceAttribute;
  account?: Account;
}

export const Reference = ({ account, attribute }: ReferenceProps) => {
  const [references, setReferences] = useState<ReferenceInterface[]>([]);

  useEffect(() => {
    if (account && account.references && Array.isArray(account.references)) {
      setReferences(account.references);
    }
  }, [account]);

  return (
    <div>
      {references
        .filter((reference) => reference.schemaAttributeKey === attribute.key)
        .map((reference, index) => {
          return <ReferenceItem key={index} reference={reference} />;
        })}
    </div>
  );
};
