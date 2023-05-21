import { Button, TextField } from '@adobe/react-spectrum';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Account, AccountPreview } from '../../interfaces/Account';
import { selectAccount, selectSchemaByType } from '../../store/Store';
import { ApplicationStore } from '../../store/ApplicationStore';
import { SchemaType } from '../../interfaces/Schema';
import { SchemaCanvas } from '../schema/SchemaCanvas';
import { Attribute } from '../../interfaces/Attribute';

export interface FormProps {
  id: Account['id'] | undefined;
  update: (id: Account['id'] | undefined, account: AccountPreview) => void;
}

// TODO rename component
export const Form = ({ update, id }: FormProps) => {
  const [preview, setPreview] = useState<AccountPreview>({
    name: '',
    attributes: undefined,
  });

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, SchemaType.Account)
  );

  const handlePreviewUpdate = (key: string, value: Attribute[typeof key]) => {
    setPreview({
      ...preview,
      [key]: value,
    });
  };

  let isValidForm = useMemo(() => {
    if (preview.name) {
      return true;
    }

    return false;
  }, [preview]);

  const account = useSelector((store: ApplicationStore) =>
    selectAccount(store, id)
  );

  useEffect(() => {
    if (account) {
      setPreview({
        ...account,
      });
    } else {
      setPreview({
        name: '',
        attributes: undefined,
      });
    }
  }, [account]);

  const validate = (values: Attribute) => {
    setPreview({
      ...preview,
      attributes: {
        ...values,
      },
    });
  };

  const save = () => {
    update(id, { ...preview });
  };

  return (
    <div style={{ padding: '15px' }}>
      <div style={{ marginTop: '10px' }}>
        <TextField
          onChange={(value) => handlePreviewUpdate('name', value)}
          value={preview.name}
          aria-label="Name"
          width="100%"
          key="name"
          label="Name"
        />
      </div>

      <SchemaCanvas
        values={account?.attributes}
        schema={schema!}
        validate={validate}
      />

      <div style={{ marginTop: '24px' }}>
        <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
          Save
        </Button>
      </div>
    </div>
  );
};
