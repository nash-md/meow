import { Button } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionType, showModalError, showModalSuccess } from '../../../actions/Actions';
import { RESERVED_ATTRIBUTES } from '../../../Constants';
import {
  Schema,
  SchemaReferenceAttribute,
  SchemaSelectAttribute,
  SchemaType,
} from '../../../interfaces/Schema';
import { ApplicationStore } from '../../../store/ApplicationStore';
import { selectSchemaByType, selectToken, store } from '../../../store/Store';
import { Translations } from '../../../Translations';
import { SchemaCanvas } from '../schema/SchemaCanvas';
import { hasDuplicateEntries } from '../../../helpers/Helper';
import { SchemaHelper } from '../../../helpers/SchemaHelper';
import { getRequestClient } from '../../../helpers/RequestHelper';

const protocol = window.location.protocol;
const domain = window.location.hostname;

export interface CardSchemaProps {
  isDeveloperMode: boolean;
}

export const CardSchema = ({ isDeveloperMode }: CardSchemaProps) => {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const schema = useSelector((store: ApplicationStore) =>
    selectSchemaByType(store, SchemaType.Card)
  );

  const [updatedSchema, setUpdatedSchema] = useState<Schema>({
    type: SchemaType.Card,
    attributes: [],
  });

  useEffect(() => {
    if (schema) {
      setUpdatedSchema({ ...schema, attributes: [...schema.attributes] });
    }
  }, [schema]);

  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  const validate = (schema: Schema | undefined) => {
    if (!schema) {
      return;
    }

    const list = schema.attributes;

    if (list.some((item) => !item.name)) {
      setError('An attribute name cannot be empty');
      setIsValid(false);

      return;
    }

    const filtered: SchemaSelectAttribute[] = list
      .filter((item) => SchemaHelper.isSelectAttribute(item))
      .map((item) => item as SchemaSelectAttribute);

    if (
      filtered.some(
        (i) => !i.options || i.options.length === 0 || i.options.some((option) => !option)
      )
    ) {
      setError('A dropdown list or a value cannot be empty');
      setIsValid(false);

      return;
    }

    if (filtered.some((i) => i.options && hasDuplicateEntries(i.options))) {
      setError('Each value in a dropdown must be unique');
      setIsValid(false);

      return;
    }

    const references: SchemaReferenceAttribute[] = list
      .filter((item) => SchemaHelper.isReferenceAttribute(item))
      .map((item) => item as SchemaReferenceAttribute);

    if (references.some((r) => !r.reverseName)) {
      setError('A reverse relationship name cannot be empty');
      setIsValid(false);

      return;
    }

    if (filtered.some((i) => i.options && hasDuplicateEntries(i.options))) {
      setError('Each value in a dropdown must be unique');
      setIsValid(false);

      return;
    }

    if (list.some((item) => RESERVED_ATTRIBUTES.includes(item.name.toLocaleLowerCase()))) {
      setError('This name is reserved by the system and cannot be used');
      setIsValid(false);

      return;
    }

    let startsOrEndsWithSpaces = /(^\s+)|(\s+$)/;

    if (list.some((item) => startsOrEndsWithSpaces.test(item.name))) {
      setError('A field cannot start or end with spaces');
      setIsValid(false);

      return;
    }

    setError('');
    setIsValid(true);

    setUpdatedSchema({ ...schema });
  };

  const save = async () => {
    try {
      await client.updateSchema(updatedSchema);

      store.dispatch(showModalSuccess(Translations.SetupChangedConfirmation.en));

      let schemas = await client.fetchSchemas();

      store.dispatch({
        type: ActionType.SCHEMAS,
        payload: [...schemas],
      });
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

  return (
    <div className="content-box">
      <div className="schema-editor-header">
        <div className="title">
          <h2>Opportunity</h2>
        </div>
        {isDeveloperMode ? (
          <div className="endpoint">
            <b>POST/GET:</b> {protocol}//
            {domain}/api/cards
          </div>
        ) : null}
      </div>

      <SchemaCanvas schema={updatedSchema} validate={validate} />
      <div style={{ marginTop: '10px' }}>
        <div style={{ marginBottom: '5px' }}>{error}</div>
        <Button onPress={save} variant="primary" isDisabled={!isValid}>
          Save
        </Button>
      </div>
    </div>
  );
};
