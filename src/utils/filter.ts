export interface Filter {
  key?: string | number;
  text: string;
}

/** Filters elements according to the given filter. */
export function filtered<T>(elements: T[], filter: Filter): T[] {
  const filterText = filter.text.toLowerCase();
  return elements.filter((element: any) => {
    const values =
      filter.key !== undefined ? [element[filter.key]] : Object.values(element);
    return values.find(value => {
      const json = JSON.stringify(value).toLowerCase();
      return json.includes(filterText);
    });
  });
}
