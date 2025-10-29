import { useState } from "react";
import Typography from "./widgets/Typography";
import Button from "./widgets/Button";

const SearchBar = ({ searchQuery, onSearch, onClear, searchResults }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery("");
    onClear();
  };

  return (
    <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-surface)]">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by JSON path (e.g., $.user.address.city, items[0].name)"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-surface)] text-[var(--text)]"
            />
            {localQuery && (
              <Button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            )}
          </div>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <Typography className="text-green-600">
              {searchResults.length} match
              {searchResults.length !== 1 ? "es" : ""} found
            </Typography>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="text-red-500 text-sm font-medium">
            No matches found for "{searchQuery}"
          </div>
        )}
      </form>
    </div>
  );
};
export default SearchBar;
