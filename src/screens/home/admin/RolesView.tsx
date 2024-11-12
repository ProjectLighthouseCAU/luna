// TODO: enable linter when done
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role } from '@luna/contexts/api/auth/types';
import { SearchBar } from '@luna/components/SearchBar';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { getOrThrow } from '@luna/utils/result';
import {
  Button,
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
  IconCategoryPlus,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { useContext, useState } from 'react';

export function RolesView() {
  const auth = useContext(AuthContext);

  const [isLoading, setLoading] = useState(false);

  const roles = useAsyncList<Role>({
    initialSortDescriptor: {
      column: 'id',
      direction: 'ascending',
    },
    async load({ cursor, sortDescriptor, filterText }) {
      try {
        if (cursor !== undefined) {
          setLoading(false);
        }
        let items = getOrThrow(await auth.getAllRoles());
        return { items };
      } catch (error) {
        console.error(`Could not fetch roles for roles view: ${error}`);
        return { items: [] };
      }
    },
    // TODO: correct sorting
  });

  // TODO: role add/details/edit/delete modals

  const [showRoleAddModal, setShowRoleAddModal] = useState(false);
  const [showRoleEditModal, setShowRoleEditModal] = useState(false);
  const [showRoleDetailsModal, setShowRoleDetailsModal] = useState(false);
  const [showRoleDeleteModal, setShowRoleDeleteModal] = useState(false);
  const [roleId, setRoleId] = useState(0);

  return (
    // TODO: Lazy rendering
    <HomeContent
      title="Roles"
      toolbar={
        <div className="flex flex-row gap-4">
          <SearchBar
            placeholder="Search roles..."
            setQuery={roles.setFilterText}
          />
          <Tooltip content="Add role" color="success">
            <Button onPress={() => setShowRoleAddModal(true)}>
              <IconCategoryPlus className="text-lg text-success cursor-pointer active:opacity-50" />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <Table
        aria-label="Table of roles for administrators"
        removeWrapper
        sortDescriptor={roles.sortDescriptor}
        onSortChange={roles.sort}
        className="sticky-home-table"
      >
        <TableHeader>
          <TableColumn key="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="createdAt" allowsSorting>
            Created At
          </TableColumn>
          <TableColumn key="updatedAt" allowsSorting>
            Updated At
          </TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={roles.items} isLoading={isLoading}>
          {role => (
            <TableRow key={role.name}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.createdAt.toLocaleString()}</TableCell>
              <TableCell>{role.updatedAt.toLocaleString()}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details">
                    <IconEye
                      className="text-lg cursor-pointer active:opacity-50"
                      onClick={() => {
                        setRoleId(role.id);
                        setShowRoleDetailsModal(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="Edit role">
                    <IconPencil
                      className="text-lg cursor-pointer active:opacity-50"
                      onClick={() => {
                        setRoleId(role.id);
                        setShowRoleEditModal(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip color="danger" content="Delete role">
                    <IconTrash
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => {
                        setRoleId(role.id);
                        setShowRoleDeleteModal(true);
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
