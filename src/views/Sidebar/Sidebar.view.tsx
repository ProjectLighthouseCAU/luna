import { AuthContext } from '@luna/contexts/Auth';
import { Divider } from '@nextui-org/react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const auth = useContext(AuthContext);

  return (
    <>
      <ul>
        <li>
          <Link to="admin">Admin</Link>
        </li>
        <li>
          <Link to="displays">Displays</Link>
        </li>
      </ul>
      <Divider />
      <ul>
        <li>
          <Link
            onClick={() => {
              auth.setToken();
            }}
            to="/login"
            className="signout"
          >
            Sign out
          </Link>
        </li>
      </ul>
    </>
  );
}
