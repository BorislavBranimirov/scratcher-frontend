import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import {
  generateSearchPath,
  searchPagePathValue,
} from '../../common/routePaths';

const SearchPageTabs = () => {
  const { searchTab } = useParams() as {
    searchTab: searchPagePathValue;
  };
  const [searchParams] = useSearchParams();
  const searchPattern = searchParams.get('q');

  const searchScratchesPath = !searchPattern
    ? generateSearchPath({ searchTab: 'scratches' })
    : generateSearchPath({ searchTab: 'scratches' }) + '?q=' + searchPattern;
  const searchUsersPath = !searchPattern
    ? generateSearchPath({ searchTab: 'users' })
    : generateSearchPath({ searchTab: 'users' }) + '?q=' + searchPattern;

  return (
    <div className="flex border-b border-primary">
      <div
        className={`grow flex justify-center transition-colors ${
          searchTab === 'scratches' ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
          }
          to={searchScratchesPath}
          end
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Scratches</span>
            {searchTab === 'scratches' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
            )}
          </div>
        </NavLink>
      </div>
      <div
        className={`grow flex justify-center transition-colors ${
          searchTab === 'users' ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
          }
          to={searchUsersPath}
          end
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Users</span>
            {searchTab === 'users' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
            )}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default SearchPageTabs;
