import { RouteLink } from '@luna/components/RouteLink';
import { AuthContext } from '@luna/contexts/Auth';
import { ROUTE_TREE } from '@luna/routes';
import { Divider } from '@nextui-org/react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const auth = useContext(AuthContext);

  return (
    <>
      <RouteLink node={ROUTE_TREE} childrenOnly />
      <Divider />
      <ul>
        <li>
          <Link
            onClick={() => {
              // TODO: Actually sign out
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
