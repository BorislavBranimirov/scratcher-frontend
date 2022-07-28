import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PageLayout from '../../common/PageLayout';
import { settingsPageTabValue } from '../../common/routePaths';
import ChangePasswordPage from './ChangePasswordPage';
import SettingsBasePage from './SettingsBasePage';
import EditProfilePage from './EditProfilePage';
import DeleteAccountPage from './DeleteAccountPage';
import ThemePickerPage from '../theme/ThemePickerPage';

const SettingsPage = () => {
  const { settingsTab } = useParams() as {
    settingsTab?: settingsPageTabValue;
  };
  const navigate = useNavigate();

  let headerText = 'Settings';
  if (settingsTab === 'theme-picker') {
    headerText = 'Theme Picker';
  } else if (settingsTab === 'edit-profile') {
    headerText = 'Edit Profile';
  } else if (settingsTab === 'change-password') {
    headerText = 'Change Password';
  } else if (settingsTab === 'delete-account') {
    headerText = 'Delete Account';
  }

  return (
    <PageLayout omitBottomOffset omitSearchWindow omitSuggestedUsersWindow>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-3 z-10 flex items-center">
        {!!settingsTab && (
          <button
            className="h-full mr-4"
            data-cy="header-back-btn"
            onClick={() => {
              navigate('/settings');
            }}
          >
            <div className="relative" title="Back">
              <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
              <ArrowLeft size={16} />
            </div>
          </button>
        )}
        <h2 className="text-lg font-bold leading-6">{headerText}</h2>
      </div>
      {!settingsTab && <SettingsBasePage />}
      {settingsTab === 'theme-picker' && <ThemePickerPage />}
      {settingsTab === 'edit-profile' && <EditProfilePage />}
      {settingsTab === 'change-password' && <ChangePasswordPage />}
      {settingsTab === 'delete-account' && <DeleteAccountPage />}
    </PageLayout>
  );
};

export default SettingsPage;
