import { useLayoutEffect } from 'react';
import { Loader } from 'react-feather';
import SuggestedUsersWindow from '../features/suggestedUsers/SuggestedUsersWindow';
import SearchInput from './SearchInput';

const PageLayout = ({
  isLoading,
  isSoftLoading,
  omitBottomOffset,
  omitSearchWindow,
  omitSuggestedUsersWindow,
  children,
}: {
  isLoading?: boolean;
  isSoftLoading?: boolean;
  omitBottomOffset?: boolean;
  omitSearchWindow?: boolean;
  omitSuggestedUsersWindow?: boolean;
  children?: React.ReactNode;
}) => {
  useLayoutEffect(() => {
    if (isSoftLoading) {
      // since soft loading doesn't unmount the page content, it will keep
      // the scroll from the previous page, so scroll to top of page manually
      window.scrollTo({ top: 0 });
    }
  }, [isSoftLoading]);

  return (
    <>
      <div className="relative col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        {isLoading ? (
          <div className="h-full w-full flex justify-center items-center">
            <Loader size={32} className="animate-spin-slow" />
          </div>
        ) : (
          <>
            {isSoftLoading && (
              <div className="absolute z-20 inset-0 bg-backdrop-themed">
                <div className="sticky top-[calc(50vh-16px)] w-full flex justify-center">
                  <Loader size={32} className="animate-spin-slow" />
                </div>
              </div>
            )}
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
