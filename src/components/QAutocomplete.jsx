import {
  Input,
  Listbox,
  ListboxItem,
  Chip,
} from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import useSearchBusinesses from "../hooks/useSearchBusinesses";

const QAutoComplete = ({ onSearch, onLocationClick = null, searchQuery }) => {
  const [showResults, setShowResults] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
      if (inputValue.length >= 2) {
        onSearch(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  // Update input when searchQuery prop changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { businesses: searchResults, isLoading } = useSearchBusinesses({
    query: debouncedQuery,
    lat: null,
    lng: null,
  });

  const results = searchResults?.payload || searchResults || [];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowResults(true);
  };

  const handleResultClick = (businessName) => {
    setInputValue(businessName);
    setShowResults(false);
    onSearch(businessName);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowResults(false);
      onSearch(inputValue);
    }
    if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setDebouncedQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(true)}
        className="w-full"
        placeholder="Rechercher un centre ou un service..."
        startContent={<IoSearchOutline className="text-gray-400" />}
        endContent={
          <div className="flex items-center gap-2">
            {inputValue && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 text-sm"
                type="button"
              >
                ✕
              </button>
            )}
            <button
              className="focus:outline-none hover:scale-110 transition-transform text-primary-500 hover:text-primary-700"
              type="button"
              onClick={onLocationClick}
              title="Centres proches de moi"
            >
              <IoLocationOutline fontSize={24} />
            </button>
          </div>
        }
      />
      
      {/* Search Results Dropdown */}
      {showResults && debouncedQuery.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Recherche en cours...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Aucun résultat trouvé pour "{debouncedQuery}"</p>
              <p className="text-sm mt-1">Essayez avec d'autres termes</p>
            </div>
          ) : (
            <Listbox
              aria-label="Résultats de recherche"
              onAction={(key) => {
                const selected = results.find((r) => r.id === key);
                if (selected) {
                  handleResultClick(selected.name);
                }
              }}
            >
              {results.slice(0, 5).map((business) => (
                <ListboxItem
                  key={business.id}
                  textValue={business.name}
                  className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{business.name}</span>
                    {business.address && (
                      <span className="text-sm text-gray-500">{business.address}</span>
                    )}
                    {business.services && business.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {business.services.slice(0, 3).map((service, idx) => (
                          <Chip key={idx} size="sm" variant="flat" color="primary">
                            {service.name}
                          </Chip>
                        ))}
                        {business.services.length > 3 && (
                          <Chip size="sm" variant="flat">
                            +{business.services.length - 3}
                          </Chip>
                        )}
                      </div>
                    )}
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          )}
          
          {!isLoading && results.length > 5 && (
            <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowResults(false);
                  onSearch(debouncedQuery);
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Voir tous les {results.length} résultats
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QAutoComplete;
