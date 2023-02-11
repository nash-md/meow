import { Button } from '@adobe/react-spectrum';
import { DateTime } from 'luxon';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ActionType } from '../actions/Actions';
import { Form } from '../components/hire/Form';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { selectUsers, store } from '../store/Store';

export const HirePage = () => {
  const { client } = useContext(RequestHelperContext);
  const users = useSelector(selectUsers);

  useEffect(() => {
    const execute = async () => {
      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  return (
    <div
      style={{
        padding: '10px',
        paddingLeft: '20px',
        maxWidth: '800px',
        backgroundColor: 'white',
      }}
    >
      <Form />

      <div style={{ height: '10px' }}></div>

      <h2 style={{ margin: 0 }}>Users</h2>
      <table>
        <tbody>
          {users.map((user) => {
            const ago = user.createdAt
              ? DateTime.fromISO(user.createdAt).toRelative()
              : '';

            return (
              <tr key={user.id}>
                <td style={{ width: '200px' }}>
                  <b>{user.name}</b>
                </td>
                <td>{ago}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <h2 style={{ margin: 0 }}>Hire</h2>
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
              Finn is a highly intelligent with a tendency to be bossy at times.
              Despite his bossy demeanor, Finn is a true friend to those he
              cares about. With his charming personality and strategic mind,
              Finn is a force to be reckoned with in the virtual world. Whether
              he's leading a team to victory or supporting his friends through
              tough challenges, Finn is always there to lend a helping hand.
            </td>
            <td style={{ padding: '10px' }}>
              <Button variant="primary">Hire</Button>
            </td>
          </tr>

          <tr>
            <td>
              <img src="d.png" style={{ width: '100px' }} />
            </td>
            <td style={{ padding: '20px', fontSize: '1.2em' }}>
              <h4 style={{ fontSize: '1.2em', margin: '0' }}>Whisker</h4>
              Whisker is an extremely knowledgeable cat with a strong work
              ethic. She is always calm and collected, no matter what obstacles
              she may face. Whisker is known for her dedication to her work,
              often working late into the night to make sure that her projects
              are completed to the best of her ability. Despite her long hours,
              she remains calm and focused, never allowing the pressures of the
              job to get the best of her.
            </td>
            <td style={{ padding: '10px' }}>
              <Button variant="primary">Hire</Button>
            </td>
          </tr>

          <tr>
            <td>
              <img src="f.png" style={{ width: '100px' }} />
            </td>
            <td style={{ padding: '20px', fontSize: '1.2em' }}>
              <h4 style={{ fontSize: '1.2em', margin: '0' }}>Carly</h4>
              Charly is a nervous and inexperienced dog with a strong
              personality. Despite his lack of experience, Charly is not afraid
              to express his opinions on things, even if he doesn't fully
              understand them. His eagerness to learn and strong will often make
              up for his lack of confidence. Charly's nervousness can sometimes
              get the best of him, but he never gives up. His strong opinions
              and willingness to speak his mind, combined with his eagerness to
              learn make him unique.
            </td>
            <td style={{ padding: '10px' }}>
              <Button variant="primary">Hire</Button>
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
              control freak and likes to keep a close eye on every aspect of his
              work, leaving nothing to chance. Despite his tendency to
              micro-manage and his love for all things shiny, Snickers is a true
              friend at heart
            </td>
            <td style={{ padding: '10px' }}>
              <Button variant="primary">Hire</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
