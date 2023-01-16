import { RouteLinks } from '@luna/components/RouteLinks';
import { AuthContext } from '@luna/contexts/Auth';
import { Divider } from '@nextui-org/react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const auth = useContext(AuthContext);

  return (
    <>
      <RouteLinks />
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
