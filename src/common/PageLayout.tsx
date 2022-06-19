import SuggestedUsersWindow from '../features/suggestedUsers/SuggestedUsersWindow';

const PageLayout = ({
  omitSuggestedUsersWindow,
  children,
}: {
  omitSuggestedUsersWindow?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        {children}
      </div>
      <div className="hidden lg:block lg:ml-6 lg:col-span-3 lg:mr-12 xl:mr-0">
        {!omitSuggestedUsersWindow && <SuggestedUsersWindow />}
      </div>
    </>
  );
};

export default PageLayout;
