import { createContext, useContext } from 'react';

console.log({
  createContext,
  useContext,
});

export const LocationContext = createContext();
export function useLocation() {
  return useContext(LocationContext);
}
