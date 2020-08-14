import { useState, SyntheticEvent } from 'react';

function containsQuery(value: string, query: string): boolean {
  return value
    .toLowerCase()
    .includes(query.toLowerCase());
}

const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

interface Autocomplete<T> {
  results: Array<T>,
  search: (query: string) => void;
  handleSearch: (e: SyntheticEvent) => void;
}

export const useAutocomplete = <T = string>(data: Array<T>, property?: (keyof T)[])
  : Autocomplete<T> => {
  const [results, setResults] = useState<T[]>([]);

  function filterResults(item: T, query: string): boolean {
    if (typeof item === 'string') {
      return containsQuery(item, query);
    }
    if (typeof item === 'object' && property) {
      if (property.length < 1) {
        throw new Error('Array with search params cant be empty!');
      }
      return property.some((prop) => {
        const value = item[prop as keyof T];
        return typeof value === 'string' && containsQuery(value, query);
      });
    }
    return false;
  }

  const search = (query: string): void => {
    const searchResults = data.filter((item) => filterResults(item, query));
    setResults(searchResults);
  };

  const handleSearch = (e: SyntheticEvent): void => {
    const input = e.target as HTMLInputElement;
    search(input.value);
  };

  return {
    handleSearch, results, search,
  };
};
