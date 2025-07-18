// src/Context/SearchContext.jsx
import { createContext, useState } from "react";

// Create the context
export const SearchContext = createContext();

// Create the provider component
const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
