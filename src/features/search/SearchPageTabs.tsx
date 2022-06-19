import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import {
  generateSearchPath,
  searchPagePathValue,
} from '../../common/routePaths';

const SearchPageTabs = () => {
  const { tab } = useParams() as {
    tab: searchPagePathValue;
  };
  const [searchParams] = useSearchParams();
  const searchPattern = searchParams.get('q');

  const searchScratchesPath = !searchPattern
    ? generateSearchPath({ tab: 'scratches' })
    : generateSearchPath({ tab: 'scratches' }) + '?q=' + searchPattern;
  const searchUsersPath = !searchPattern
    ? generateSearchPath({ tab: 'users' })
    : generateSearchPath({ tab: 'users' }) + '?q=' + searchPattern;

  return (
    <div className="flex border-b border-primary">
      <div
        className={`grow flex justify-center transition-colors ${
          tab === 'scratches' ? 'hover:bg-primary/10' : 'hover:bg-primary/5'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${
              isActive ? 'font-bold' : 'text-secondary'
            }`
          }
          to={searchScratchesPath}
          end
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Scratches</span>
            {tab === 'scratches' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-blue"></div>
            )}
          </div>
        </NavLink>
      </div>
      <div
        className={`grow flex justify-center transition-colors ${
          tab === 'users' ? 'hover:bg-primary/10' : 'hover:bg-primary/5'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${
              isActive ? 'font-bold' : 'text-secondary'
            }`
          }
          to={searchUsersPath}
          end
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Users</span>
            {tab === 'users' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-blue"></div>
            )}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default SearchPageTabs;
