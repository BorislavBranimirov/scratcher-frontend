import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PageLayout from '../../common/PageLayout';
import { settingsPageTabValue } from '../../common/routePaths';
import ChangePasswordPage from './ChangePasswordPage';
import SettingsBasePage from './SettingsBasePage';
import EditProfilePage from './EditProfilePage';
import DeleteAccountPage from './DeleteAccountPage';

const SettingsPage = () => {
  const { tab } = useParams() as {
    tab?: settingsPageTabValue;
  };
  const navigate = useNavigate();

  let headerText = 'Settings';
  if (tab === 'edit-profile') {
    headerText = 'Edit Profile';
  } else if (tab === 'change-password') {
    headerText = 'Change Password';
  } else if (tab === 'delete-account') {
    headerText = 'Delete Account';
  }

  return (
    <PageLayout omitSearchWindow omitSuggestedUsersWindow>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-3 z-10 flex items-center">
        {!!tab && (
          <button
            className="h-full mr-4"
            onClick={() => {
              navigate('/settings');
            }}
          >
            <div className="relative" title="Back">
              <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
              <ArrowLeft size={16} />
            </div>
          </button>
        )}
        <h2 className="text-lg font-bold leading-6">{headerText}</h2>
      </div>
      {!tab && <SettingsBasePage />}
      {tab === 'edit-profile' && <EditProfilePage />}
      {tab === 'change-password' && <ChangePasswordPage />}
      {tab === 'delete-account' && <DeleteAccountPage />}
    </PageLayout>
  );
};

export default SettingsPage;
