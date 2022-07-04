import SuggestedUsersWindow from '../features/suggestedUsers/SuggestedUsersWindow';
import SearchInput from './SearchInput';

const PageLayout = ({
  omitBottomOffset,
  omitSearchWindow,
  omitSuggestedUsersWindow,
  children,
}: {
  omitBottomOffset?: boolean;
  omitSearchWindow?: boolean;
  omitSuggestedUsersWindow?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        {children}
        {!omitBottomOffset && (
          <div id="page-layout-content-offset" className="h-[70vh]"></div>
        )}
      </div>
      <div className="hidden lg:flex lg:flex-col lg:gap-y-3 lg:ml-6 lg:col-span-3 lg:mr-12 pt-2">
        {!omitSearchWindow && <SearchInput />}
        {!omitSuggestedUsersWindow && <SuggestedUsersWindow />}
      </div>
    </>
  );
};

export default PageLayout;
