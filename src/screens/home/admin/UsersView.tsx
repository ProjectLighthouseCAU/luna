import { Role, User } from '@luna/contexts/api/auth/types';
import { UserAddModal } from '@luna/modals/UserAddModal';
import { UserDeleteModal } from '@luna/modals/UserDeleteModal';
import { UserDetailsModal } from '@luna/modals/UserDetailsModal';
import { UserEditModal } from '@luna/modals/UserEditModal';
import { SearchBar } from '@luna/components/SearchBar';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { getOrThrow } from '@luna/utils/result';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { useAsyncList } from '@react-stately/data';
import {
  IconEye,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUserPlus,
} from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { InView } from 'react-intersection-observer';

export function UsersView() {
  const auth = useContext(AuthContext);

  const [isLoading, setLoading] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const users = useAsyncList<User>({
    initialSortDescriptor: {
      column: 'id',
      direction: 'ascending',
    },
    async load({ cursor, sortDescriptor, filterText }) {
      try {
        if (cursor !== undefined) {
          setLoading(false);
        }

        const page = parseInt(cursor ?? '0');
        let items = getOrThrow(
          await auth.getAllUsers({
            page,
            perPage: 50,
            filter: filterText ? { text: filterText } : undefined,
            sorting: sortDescriptor?.column
              ? {
                  key: sortDescriptor.column,
                  ascending: sortDescriptor.direction === 'ascending',
                }
              : undefined,
          })
        );
        setHasMore(items.length > 0);
        return { items, cursor: `${page + 1}` };
      } catch (error) {
        console.error(`Could not fetch users for users view: ${error}`);
        return { items: [] };
      }
    },
  });

  useEffect(() => {
    if (hasMore && needsMore) {
      users.loadMore();
    }
  }, [users, hasMore, needsMore]);

  const [showUserAddModal, setShowUserAddModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [userId, setUserId] = useState(0);

  const [allRoles, setAllRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesResult = await auth.getAllRoles();
      if (rolesResult.ok) {
        setAllRoles(rolesResult.value);
      } else {
        console.log('Could not get roles:', rolesResult.error);
      }
    };
    fetchRoles();
  }, [auth]);

  return (
    // TODO: Lazy rendering
    <HomeContent
      title="Users"
      toolbar={
        <div className="flex flex-row gap-4">
          <Tooltip content="Add user" color="success">
            <Button onPress={() => setShowUserAddModal(true)} isIconOnly>
              <IconUserPlus className="text-lg text-success cursor-pointer active:opacity-50" />
            </Button>
          </Tooltip>
          <SearchBar
            placeholder="Search users..."
            setQuery={users.setFilterText}
          />
        </div>
      }
    >
      <UserAddModal isOpen={showUserAddModal} setOpen={setShowUserAddModal} />
      <UserEditModal
        id={userId}
        isOpen={showUserEditModal}
        setOpen={setShowUserEditModal}
      />
      <UserDetailsModal
        id={userId}
        isOpen={showUserDetailsModal}
        setOpen={setShowUserDetailsModal}
      />
      <UserDeleteModal
        id={userId}
        isOpen={showUserDeleteModal}
        setOpen={setShowUserDeleteModal}
      />
      <Table
        aria-label="Table of users for administrators"
        removeWrapper
        sortDescriptor={users.sortDescriptor}
        onSortChange={users.sort}
        className="sticky-home-table"
        bottomContent={
          hasMore ? (
            <InView onChange={setNeedsMore}>
              {({ inView, ref }) => <Spinner ref={ref} />}
            </InView>
          ) : null
        }
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
          <TableColumn key="createdAt" allowsSorting>
            Created At
          </TableColumn>
          <TableColumn key="updatedAt" allowsSorting>
            Updated At
          </TableColumn>
          <TableColumn key="lastSeen" allowsSorting>
            Last Seen
          </TableColumn>
          <TableColumn key="roles" allowsSorting>
            Roles
          </TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={users.items} isLoading={isLoading}>
          {user => (
            <TableRow key={user.username}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.createdAt.toLocaleString()}</TableCell>
              <TableCell>{user.updatedAt.toLocaleString()}</TableCell>
              <TableCell>{user.lastSeen.toLocaleString()}</TableCell>
              <TableCell>
                {user.roles.map(role => (
                  <Chip
                    key={role.id}
                    onClose={async () => {
                      console.log(
                        'removing user',
                        user.username,
                        'from role',
                        role.name
                      );
                      const result = await auth.removeUserFromRole(
                        user.id,
                        role.id
                      );
                      if (!result.ok) {
                        console.log(result.error);
                        return;
                      }
                      users.reload();
                    }}
                    className="m-1 hover:bg-danger"
                  >
                    {role.name}
                  </Chip>
                ))}
                <Dropdown>
                  <DropdownTrigger>
                    <Chip
                      color="success"
                      className="p-0 hover:cursor-pointer"
                      variant="bordered"
                    >
                      <IconPlus size="15px" />
                    </Chip>
                  </DropdownTrigger>
                  <DropdownMenu
                    items={allRoles.filter(
                      role =>
                        undefined === user.roles.find(r => r.id === role.id)
                    )}
                    onAction={async key => {
                      console.log('adding user', user.username, 'to role', key);
                      const roleid: number = parseInt(key.toString());
                      const result = await auth.addUserToRole(user.id, roleid);
                      if (!result.ok) {
                        console.log(result.error);
                        return;
                      }
                      users.reload();
                    }}
                  >
                    {(role: Role) => (
                      <DropdownItem
                        key={role.id}
                        className="data-[hover=true]:bg-success"
                      >
                        {role.name}
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details">
                    <IconEye
                      className="text-lg cursor-pointer active:opacity-50"
                      onClick={() => {
                        setUserId(user.id);
                        setShowUserDetailsModal(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="Edit user">
                    <IconPencil
                      className="text-lg cursor-pointer active:opacity-50"
                      onClick={() => {
                        setUserId(user.id);
                        setShowUserEditModal(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <IconTrash
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => {
                        setUserId(user.id);
                        setShowUserDeleteModal(true);
                      }}
                    />
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
