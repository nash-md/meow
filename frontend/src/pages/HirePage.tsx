import { Button } from '@adobe/react-spectrum';
import { useState } from 'react';
import { Form } from '../components/hire/Form';
import { UserList } from '../components/hire/UserList';

function createInviteUrl(invite: string) {
  return `${window.location.protocol}//${window.location.host}?invite=${invite}`;
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (error) {
    console.error('Failed to copy text: ', error);
  }
}

export const HirePage = () => {
  return (
    <div className="canvas">
      <Form
        createInviteUrl={createInviteUrl}
        copyToClipboard={copyToClipboard}
      />

      <UserList
        createInviteUrl={createInviteUrl}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
};
