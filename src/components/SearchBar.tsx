import { useDebounce } from '@luna/hooks/useDebounce';
import { Input, Tooltip } from '@heroui/react';
import { IconSearch } from '@tabler/icons-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  tooltip?: ReactNode;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  query?: string;
  setQuery: (query: string) => void;
}

export function SearchBar({
  placeholder,
  fullWidth,
  className = '',
  tooltip,
  tooltipPlacement,
  query,
  setQuery,
}: SearchBarProps) {
  const [value, setValue] = useState(query ?? '');
  const [isUpdating, setUpdating] = useState(false);

  // We need this relatively complicated synchronization logic to ensure the
  // user's input is not overwritten as they type (and our debouncer is
  // running), while simultaneously flushing external updates to the search
  // query to the search bar when they aren't typing.

  useEffect(() => {
    if (!isUpdating && query !== undefined) {
      setValue(query);
    }
  }, [isUpdating, query]);

  const updateQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setUpdating(false);
    },
    [setQuery]
  );

  const updateQueryDebounced = useDebounce(updateQuery, 200);

  const onValueChange = useCallback(
    (value: string) => {
      setUpdating(true);
      setValue(value);
      updateQueryDebounced(value);
    },
    [updateQueryDebounced]
  );

  const clearQuery = useCallback(() => onValueChange(''), [onValueChange]);

  const input = (
    <div className={`${fullWidth ? '' : 'max-w-60'} ${className}`}>
      <Input
        startContent={<IconSearch />}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        onClear={clearQuery}
      />
    </div>
  );

  return (
    <Tooltip
      content={tooltip}
      placement={tooltipPlacement}
      isDisabled={tooltip === undefined}
    >
      {input}
    </Tooltip>
  );
}
