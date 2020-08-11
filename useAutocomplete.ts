// Core
import { useState } from 'react';

export const useAutocomplete = <T>(
  data: Array<T>,
  property?: Partial<T>,
) => {
  // Declaring state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);

  // Creating type
  // for overloading function
  // it will allow as to accept
  // both simple string arrays
  // and sort by specific properties

  type Overloaded = {
    (element: string): boolean;
    (element: T): boolean;
  };

  // Simple helper function
  const getValue = (value: string, target: string) => value
    .toLowerCase()
    .includes(target.toLowerCase());

  // Getting keys
  const getObjectKeys = (
    criteria: Partial<T>,
  ) => Object.keys(criteria) as (keyof T)[];

  const findResults: Overloaded = (element: any) => {
    if (property) {
      const propertyValue = getObjectKeys(property);
      return propertyValue.every((value) => getValue(element[value], query));
    }
    return getValue(element, query);
  };

  const handleSearch = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setQuery(target.value);
    const searchResults = data.filter(findResults);
    setResults(searchResults);
  };

  return { handleSearch, results, query };
};
