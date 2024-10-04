import { User } from '@luna/api/auth/types';
import { AuthContext } from '@luna/contexts/AuthContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { getOrThrow } from '@luna/utils/result';
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { useAsyncList } from '@react-stately/data';
import {
  IconEye,
  IconPencil,
  IconTrash,
  IconUserPlus,
} from '@tabler/icons-react';
import { useContext } from 'react';
import { SortDescriptor } from 'react-stately';

export function UsersView() {
  const auth = useContext(AuthContext);

  const sortList = (items: User[], sortDescriptor: SortDescriptor): User[] => {
    let col = sortDescriptor.column ?? 'id';
    return items.sort((a: any, b: any): number => {
      let first = a[col];
      let second = b[col];
      let cmp =
        (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1;
      }
      return cmp;
    });
  };

  const users = useAsyncList({
    initialSortDescriptor: {
      column: 'id',
      direction: 'ascending',
    },
    async load() {
      try {
        let items = getOrThrow(await auth.getAllUsers());
        items = sortList(items, { column: 'id', direction: 'ascending' });
        return { items };
      } catch (error) {
        console.error(`Could not fetch users for users view: ${error}`);
        return { items: [] };
      }
    },
    async sort({ items, sortDescriptor }) {
      return { items: sortList(items, sortDescriptor) };
    },
  });

  return (
    // TODO: Lazy rendering
    <HomeContent title="Users">
      <Tooltip content="Add user" color="success">
        <Button className="mb-5">
          {/* TODO: add user (maybe open modal to input data) */}
          <IconUserPlus className="text-lg text-success cursor-pointer active:opacity-50"></IconUserPlus>
        </Button>
      </Tooltip>
      <Table
        aria-label="Table of users for administrators"
        removeWrapper
        // TODO: Add some padding somewhere to make the sticky header look nicer
        isHeaderSticky
        sortDescriptor={users.sortDescriptor}
        onSortChange={users.sort}
      >
        <TableHeader>
          <TableColumn key="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn key="username" allowsSorting>
            Username
          </TableColumn>
          <TableColumn key="email" allowsSorting>
            E-Mail
          </TableColumn>
          {/* TODO: move to details modal: <TableColumn key="roles" allowsSorting>
            Roles
          </TableColumn> */}
          <TableColumn key="createdAt" allowsSorting>
            Created At
          </TableColumn>
          <TableColumn key="updatedAt" allowsSorting>
            Updated At
          </TableColumn>
          <TableColumn key="lastSeen" allowsSorting>
            Last Seen
          </TableColumn>
          <TableColumn key="permanentApiToken" allowsSorting>
            Permanent API-Token
          </TableColumn>
          {/* TODO: move to details modal: <TableColumn key="registrationKey" allowsSorting>
            Registration-Key
          </TableColumn> */}
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={users.items}>
          {user => (
            <TableRow key={user.username}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              {/* TODO: move to details modal: <TableCell>{user.roles?.map(role => role.name)}</TableCell> */}
              <TableCell>{user.createdAt?.toLocaleString()}</TableCell>
              <TableCell>{user.updatedAt?.toLocaleString()}</TableCell>
              <TableCell>{user.lastSeen?.toLocaleString()}</TableCell>
              <TableCell>
                {user.permanentApiToken ? (
                  <Chip color="success" variant="flat">
                    true
                  </Chip>
                ) : (
                  <Chip color="danger" variant="flat">
                    false
                  </Chip>
                )}
              </TableCell>
              {/* TODO: move to details modal: <TableCell>{user.registrationKey?.key}</TableCell> */}
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details">
                    <IconEye className="text-lg cursor-pointer active:opacity-50"></IconEye>
                    {/* TODO: show details of user: roles, registration key, ... (maybe open a modal?)*/}
                  </Tooltip>
                  <Tooltip content="Edit user">
                    <IconPencil className="text-lg cursor-pointer active:opacity-50"></IconPencil>
                    {/* TODO: make user editable (maybe open a modal or edit in table?) */}
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <IconTrash className="text-lg text-danger cursor-pointer active:opacity-50"></IconTrash>
                    {/* TODO: confirm deletion using popup, then send delete request */}
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </HomeContent>
  );
}
