import { ArrowRight, Edit, Key, Monitor, UserX } from 'react-feather';
import { Link } from 'react-router-dom';

const SettingsBasePage = () => {
  return (
    <div className="flex flex-col">
      <div className="transition-colors hover:bg-hover-1">
        <Link
          className="flex justify-between items-center px-4 py-3 w-full"
          to="theme-picker"
        >
          <div className="flex gap-3 items-center">
            <Monitor size={20} />
            <span>Theme Picker</span>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>
      <div className="transition-colors hover:bg-hover-1">
        <Link
          className="flex justify-between items-center px-4 py-3 w-full"
          to="edit-profile"
        >
          <div className="flex gap-3 items-center">
            <Edit size={20} />
            <span>Edit Profile</span>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>
      <div className="transition-colors hover:bg-hover-1">
        <Link
          className="flex justify-between items-center px-4 py-3 w-full"
          to="change-password"
        >
          <div className="flex gap-3 items-center">
            <Key size={20} />
            <span>Change Password</span>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>
      <div className="transition-colors hover:bg-hover-1">
        <Link
          className="flex justify-between items-center px-4 py-3 w-full"
          to="delete-account"
        >
          <div className="flex gap-3 items-center">
            <UserX size={20} />
            <span>Delete Account</span>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default SettingsBasePage;
