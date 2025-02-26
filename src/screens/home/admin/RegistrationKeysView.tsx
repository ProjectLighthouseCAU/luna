// TODO: enable linter when done
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RegistrationKey } from '@luna/contexts/api/auth/types';
import { SearchBar } from '@luna/components/SearchBar';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
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
} from '@heroui/react';
import { useAsyncList } from '@react-stately/data';
import { IconEye, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useContext, useState } from 'react';

export function RegistrationKeysView() {
  const auth = useContext(AuthContext);

  const [isLoading, setLoading] = useState(false);

  const keys = useAsyncList<RegistrationKey>({
    initialSortDescriptor: {
      column: 'id',
      direction: 'ascending',
    },
    async load({ cursor, sortDescriptor, filterText }) {
      try {
        if (cursor !== undefined) {
          setLoading(false);
        }
        let items = getOrThrow(await auth.getAllRegistrationKeys());
        return { items };
      } catch (error) {
        console.error(
          `Could not fetch registration keys for registration keys view: ${error}`
        );
        return { items: [] };
      }
    },
    // TODO: correct sorting
  });

  const [showKeyAddModal, setShowKeyAddModal] = useState(false);
  const [showKeyEditModal, setShowKeyEditModal] = useState(false);
  const [showKeyDetailsModal, setShowKeyDetailsModal] = useState(false);
  const [showKeyDeleteModal, setShowKeyDeleteModal] = useState(false);
  const [keyId, setKeyId] = useState(0);

  return (
    // TODO: Lazy rendering
    <HomeContent
      title="Registration Keys"
      toolbar={
        <div className="flex flex-row gap-4">
          <SearchBar
            placeholder="Search registration keys..."
            setQuery={keys.setFilterText}
          />
          <Tooltip content="Add key" color="success">
            <Button onPress={() => setShowKeyAddModal(true)}>
              <IconPlus className="text-lg text-success cursor-pointer active:opacity-50" />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <Table
        aria-label="Table of registration keys for administrators"
        removeWrapper
        sortDescriptor={keys.sortDescriptor}
        onSortChange={keys.sort}
        className="sticky-home-table"
      >
        <TableHeader>
          <TableColumn key="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn key="key" allowsSorting>
            Key
          </TableColumn>
          <TableColumn key="description" allowsSorting>
            Description
          </TableColumn>
          <TableColumn key="createdAt" allowsSorting>
            Created At
          </TableColumn>
          <TableColumn key="updatedAt" allowsSorting>
            Updated At
          </TableColumn>
          <TableColumn key="expiresAt" allowsSorting>
            Expires At
          </TableColumn>
          <TableColumn key="permanent" allowsSorting>
            Permanent
          </TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={keys.items} isLoading={isLoading}>
          {key => (
            <TableRow key={key.key}>
              <TableCell>{key.id}</TableCell>
              <TableCell>{key.key}</TableCell>
              <TableCell>{key.description}</TableCell>
              <TableCell>{key.createdAt.toLocaleString()}</TableCell>
              <TableCell>{key.updatedAt.toLocaleString()}</TableCell>
              <TableCell>{key.expiresAt.toLocaleString()}</TableCell>
              <TableCell>
                {key.permanent ? (
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
                        setKeyId(key.id);
                        setShowKeyDetailsModal(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip content="Edit key">
                    <IconPencil
                      className="text-lg cursor-pointer active:opacity-50"
                      onClick={() => {
                        setKeyId(key.id);
                        setShowKeyEditModal(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip color="danger" content="Delete key">
                    <IconTrash
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => {
                        setKeyId(key.id);
                        setShowKeyDeleteModal(true);
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
