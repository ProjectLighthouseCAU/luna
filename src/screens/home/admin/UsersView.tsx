import { User } from '@luna/client/auth/User';
import { AuthContext } from '@luna/contexts/AuthContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import {
  SortDescriptor,
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
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'username',
    direction: 'ascending',
  });

  // TODO: Actually sort items

  useEffect(() => {
    (async () => {
      setUsers(await auth.client.getAllUsers());
    })();
  }, [auth.client]);

  return (
    // TODO: Lazy rendering
    <HomeContent title="Users">
      <Table
        aria-label="Table of users for administrators"
        removeWrapper
        // TODO: Add some padding somewhere to make the sticky header look nicer
        isHeaderSticky
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn allowsSorting>Username</TableColumn>
          <TableColumn allowsSorting>Role</TableColumn>
          <TableColumn allowsSorting>Course</TableColumn>
          <TableColumn allowsSorting>Created At</TableColumn>
          <TableColumn allowsSorting>Last Seen</TableColumn>
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
