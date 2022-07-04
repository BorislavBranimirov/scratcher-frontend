import { Loader } from 'react-feather';
import SuggestedUsersWindow from '../features/suggestedUsers/SuggestedUsersWindow';
import SearchInput from './SearchInput';

const PageLayout = ({
  isLoading,
  omitBottomOffset,
  omitSearchWindow,
  omitSuggestedUsersWindow,
  children,
}: {
  isLoading?: boolean;
  omitBottomOffset?: boolean;
  omitSearchWindow?: boolean;
  omitSuggestedUsersWindow?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        {isLoading ? (
          <div className="h-full w-full flex justify-center items-center">
            <Loader size={32} className="animate-spin-slow" />
          </div>
        ) : (
          <>
            {children}
            {!omitBottomOffset && (
              <div id="page-layout-content-offset" className="h-[70vh]"></div>
            )}
          </>
        )}
      </div>
      <div className="hidden lg:block lg:ml-6 lg:col-span-3 lg:mr-12">
        <div className="sticky flex flex-col gap-y-3 top-2">
          {!omitSearchWindow && <SearchInput />}
          {!omitSuggestedUsersWindow && <SuggestedUsersWindow />}
        </div>
      </div>
    </>
  );
};

export default PageLayout;
