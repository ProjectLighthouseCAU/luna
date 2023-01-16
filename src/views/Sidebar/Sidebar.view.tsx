import React from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <ul>
      <li>
        <Link to="admin">Admin</Link>
      </li>
      <li>
        <Link to="displays">Displays</Link>
      </li>
    </ul>
  );
}
