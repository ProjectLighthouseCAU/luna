import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useJsonMemo } from '@luna/hooks/useJsonMemo';
import { usePinnedDisplays } from '@luna/hooks/usePinnedDisplays';
import { useContext, useMemo } from 'react';

export function useFilteredDisplays({
  searchQuery = '',
}: {
  searchQuery?: string;
}) {
  const { users } = useContext(ModelContext);

  const pinnedDisplays = usePinnedDisplays();

  const allUsernames = useJsonMemo([...users.all.keySeq().sort()]);

  // Filter the models case-insensitively by the search query
  const filteredUsernames = useMemo(
    () =>
      allUsernames.filter(
        username =>
          !pinnedDisplays.has(username) &&
          username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [allUsernames, pinnedDisplays, searchQuery]
  );

  return {
    pinnedDisplays,
    allUsernames,
    filteredUsernames,
  };
}
