import { sorted, Sorting } from '@luna/utils/sort';

export interface Pagination {
  page: number;
  perPage: number;
  sorting?: Sorting;
}

/**
 * Extracts the given page from the given array, i.e. performs 'fake'
 * pagination.
 */
export function slicePage<T>(elements: T[], pagination?: Pagination): T[] {
  if (pagination === undefined) {
    return elements;
  }
  if (pagination.sorting) {
    elements = sorted(elements, pagination.sorting);
  }
  const offset = pagination.page;
  return elements.slice(offset, offset + pagination.perPage);
}
