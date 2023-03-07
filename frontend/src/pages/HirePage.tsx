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
  const [hire, setHire] = useState('');

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

      <div className="content-box">
        <h2>Hire</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <img src="a.png" style={{ width: '100px' }} />
              </td>
              <td
                style={{
                  paddingLeft: '20px',
                  paddingBottom: '20px',
                  paddingRight: '20px',
                  fontSize: '1.2em',
                }}
              >
                <h4 style={{ fontSize: '1.2em', margin: '0' }}>Finn</h4>
                Finn is a highly intelligent with a tendency to be bossy at
                times. Despite his bossy demeanor, Finn is a true friend to
                those he cares about. With his charming personality and
                strategic mind, Finn is a force to be reckoned with in the
                virtual world. Whether he's leading a team to victory or
                supporting his friends through tough challenges, Finn is always
                there to lend a helping hand.
                {hire === 'finn' && (
                  <div style={{ marginTop: '20px' }}>
                    I'm as happy as a virtual clam! With my brains and
                    bossiness, this new job doesn't stand a chance!
                  </div>
                )}
              </td>
              <td style={{ padding: '10px' }}>
                <Button onPress={() => setHire('finn')} variant="primary">
                  Hire
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <img src="d.png" style={{ width: '100px' }} />
              </td>
              <td style={{ padding: '20px', fontSize: '1.2em' }}>
                <h4 style={{ fontSize: '1.2em', margin: '0' }}>Whisker</h4>
                Whisker is an extremely knowledgeable cat with a strong work
                ethic. She is always calm and collected, no matter what
                obstacles she may face. Whisker is known for her dedication to
                her work, often working late into the night to make sure that
                her projects are completed to the best of her ability. Despite
                her long hours, she remains calm and focused, never allowing the
                pressures of the job to get the best of her.
                {hire === 'whisker' && (
                  <div style={{ marginTop: '20px' }}>
                    I'm thrilled to sink my claws into this new project. With my
                    vast knowledge and unshakable work ethic, success is just a
                    paw-sweep away!
                  </div>
                )}
              </td>

              <td style={{ padding: '10px' }}>
                <Button onPress={() => setHire('whisker')} variant="primary">
                  Hire
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <img src="e.png" style={{ width: '100px' }} />
              </td>
              <td style={{ padding: '20px', fontSize: '1.2em' }}>
                <h4 style={{ fontSize: '1.2em', margin: '0' }}>Carly</h4>
                Charly is a nervous and inexperienced dog with a strong
                personality. Despite his lack of experience, Charly is not
                afraid to express his opinions on things, even if he doesn't
                fully understand them. His eagerness to learn and strong will
                often make up for his lack of confidence. Charly's nervousness
                can sometimes get the best of him, but he never gives up. His
                strong opinions and willingness to speak his mind, combined with
                his eagerness to learn make him unique.
                {hire === 'charly' && (
                  <div style={{ marginTop: '20px' }}>
                    I'm barking with excitement! Even though I'm a little green,
                    I'm ready to take on this new challenge with all four paws.
                    I may be nervous, but my strong will and eagerness to learn
                    will have me rolling over this job in no time!
                  </div>
                )}
              </td>

              <td style={{ padding: '10px' }}>
                <Button onPress={() => setHire('charly')} variant="primary">
                  Hire
                </Button>
              </td>
            </tr>

            <tr>
              <td>
                <img src="c.png" style={{ width: '100px' }} />
              </td>
              <td style={{ padding: '20px', fontSize: '1.2em' }}>
                <h4 style={{ fontSize: '1.2em', margin: '0' }}>Snickers</h4>
                Snickers the micro-managing raccoon with a love for big deals.
                Snickers may be small in size, but he's big in personality and
                always has his sights set on the next big score. As a
                micro-manager, Snickers is always on the lookout for new ways to
                improve his operations and increase his profits. He's a bit of a
                control freak and likes to keep a close eye on every aspect of
                his work, leaving nothing to chance. Despite his tendency to
                micro-manage and his love for all things shiny, Snickers is a
                true friend at heart
                {hire === 'snickers' && (
                  <div style={{ marginTop: '20px' }}>
                    Oh boy, oh boy, oh boy! Another big deal coming my way, and
                    I'm ready to go nuts over it! As a micro-managing raccoon, I
                    can handle every little detail of this project, leaving
                    nothing to chance. With my sharp eye for profits and love
                    for all things shiny, this job is sure to be a real treat!
                  </div>
                )}
              </td>
              <td style={{ padding: '10px' }}>
                <Button onPress={() => setHire('snickers')} variant="primary">
                  Hire
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
