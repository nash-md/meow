import { Button, TextArea, TextField } from '@adobe/react-spectrum';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Account, AccountPreview } from '../../interfaces/Account';
import { selectAccount } from '../../store/Store';
import { ApplicationStore } from '../../store/ApplicationStore';

export interface FormProps {
  id: Account['id'] | undefined;
  update: (id: Account['id'] | undefined, account: AccountPreview) => void;
}

// TODO rename component
export const Form = ({ update, id }: FormProps) => {
  const [preview, setPreview] = useState<AccountPreview>({
    name: '',
    address: '',
    phone: '',
  });

  const handlePreviewUpdate = (key: string, value: string | number) => {
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
        address: '',
        phone: '',
      });
    }
  }, [account]);

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

      <div style={{ marginTop: '10px' }}>
        <TextArea
          onChange={(value) => handlePreviewUpdate('address', value)}
          value={preview.address}
          aria-label="Address"
          width="100%"
          key="address"
          inputMode="decimal"
          label="Address"
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <TextField
          onChange={(value) => handlePreviewUpdate('phone', value)}
          value={preview.phone}
          aria-label="Phone"
          width="100%"
          key="phone"
          inputMode="decimal"
          label="Phone"
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <Button variant="primary" onPress={save} isDisabled={!isValidForm}>
          Save
        </Button>
      </div>
    </div>
  );
};
