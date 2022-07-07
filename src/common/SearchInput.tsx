import { useRef, useState } from 'react';
import { Search, XCircle } from 'react-feather';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { generateSearchPath, searchPagePathValue } from './routePaths';

const SearchInput = () => {
  const { searchTab } = useParams() as {
    searchTab?: searchPagePathValue;
  };
  const [searchParams] = useSearchParams();
  const searchPattern = searchParams.get('q');
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>(searchPattern || '');
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const redirectTab = searchTab || 'scratches';
      if (!search) {
        navigate(generateSearchPath({ searchTab: redirectTab }));
      } else {
        navigate(
          `${generateSearchPath({ searchTab: redirectTab })}?q=${search}`
        );
      }
    }
  };

  return (
    <div
      className="w-full bg-secondary rounded-full px-3 group focus-within:outline focus-within:outline-2 focus-within:outline-accent"
      onClick={() => {
        if (inputFieldRef.current) {
          inputFieldRef.current.focus();
        }
      }}
    >
      <div className="text-sm text-muted w-full flex items-center">
        <Search
          className="flex-shrink-0 group-focus-within:text-accent"
          size={20}
        />
        <input
          className="p-3 grow min-w-0 bg-transparent border-none outline-none"
          type="text"
          name="search"
          id="search"
          ref={inputFieldRef}
          placeholder="Search Scratcher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
        <button
          className={`invisible group-focus-within:text-accent ${
            !!search ? 'group-focus-within:visible' : ''
          }`}
          onClick={() => {
            setSearch('');
          }}
        >
          <XCircle className="flex-shrink-0" size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
