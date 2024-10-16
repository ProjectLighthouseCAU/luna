export interface Sorting {
  key: string | number;
  ascending: boolean;
}

/** Sorts an array in place according to the given sorting. */
export function sort<T>(elements: T[], sorting: Sorting) {
  let col = sorting.key;
  elements.sort((a: any, b: any): number => {
    let first = a[col];
    let second = b[col];
    let cmp =
      (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
    if (!sorting.ascending) {
      cmp *= -1;
    }
    return cmp;
  });
}

/** Copies and sorts an array according to the given sorting. */
export function sorted<T>(elements: T[], sorting: Sorting): T[] {
  const sorted = [...elements];
  sort(sorted, sorting);
  return sorted;
}
