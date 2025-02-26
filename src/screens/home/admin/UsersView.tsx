import { User } from '@luna/contexts/api/auth/types';
import { UserAddModal } from '@luna/components/UserAddModal';
import { UserDeleteModal } from '@luna/components/UserDeleteModal';
import { UserDetailsModal } from '@luna/components/UserDetailsModal';
import { UserEditModal } from '@luna/components/UserEditModal';
import { SearchBar } from '@luna/components/SearchBar';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { getOrThrow } from '@luna/utils/result';
import {
  Button,
  Chip,
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

  return (
    // TODO: Lazy rendering
    <HomeContent
      title="Users"
      toolbar={
        <div className="flex flex-row gap-4">
          <SearchBar
            placeholder="Search users..."
            setQuery={users.setFilterText}
          />
          <Tooltip content="Add user" color="success">
            <Button onPress={() => setShowUserAddModal(true)}>
              <IconUserPlus className="text-lg text-success cursor-pointer active:opacity-50" />
            </Button>
          </Tooltip>
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
          <TableColumn key="permanentApiToken" allowsSorting>
            Permanent API-Token
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
