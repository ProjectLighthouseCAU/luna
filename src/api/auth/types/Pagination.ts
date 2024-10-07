export interface Pagination {
  page: number;
  perPage: number;
}

/**
 * Extracts the given page from the given array, i.e. performs 'fake'
 * pagination.
 */
export function slicePage<T>(elements: T[], pagination?: Pagination): T[] {
  if (pagination === undefined) {
    return elements;
  }
  const offset = pagination.page;
  return elements.slice(offset, offset + pagination.perPage);
}
