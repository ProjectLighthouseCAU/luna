import { User } from '@luna/client/auth/User';
import { AuthContext } from '@luna/contexts/AuthContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';

export function UsersView() {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      setUsers(await auth.client.getAllUsers());
    })();
  }, [auth.client]);

  return (
    // TODO: Lazy rendering
    <HomeContent title="Users">
      <Table>
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Course</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Last Seen</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.username}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.course}</TableCell>
              <TableCell>{user.createdAt?.toLocaleString()}</TableCell>
              <TableCell>{user.lastSeen?.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </HomeContent>
  );
}
