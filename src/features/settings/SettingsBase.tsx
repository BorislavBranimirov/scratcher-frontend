import { ArrowRight } from 'react-feather';
import { Link } from 'react-router-dom';

const SettingsBase = () => {
  return (
    <div className="flex flex-col">
      <div className="transition-colors hover:bg-primary/5">
        <Link
          className="flex justify-between items-center px-4 py-3 w-full"
          to="edit-profile"
        >
          <span>Edit Profile</span>
          <ArrowRight size={20} />
        </Link>
      </div>
      <div className="transition-colors hover:bg-primary/5">
        <Link
          className="flex justify-between items-center px-4 py-3 w-full"
          to="change-password"
        >
          <span>Change Password</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default SettingsBase;